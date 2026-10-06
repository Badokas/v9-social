# TODO: Social comments (fetch, MCP, inbox, reply)

Goal: read comments people leave on our published posts and reply to them,
first from Kiro/AI agents through MCP, then from a Postiz UI inbox.

Order of work (each phase ships as its own `-v9.<n>` release):

1. **Fetch**: poll platforms on a schedule and store comments.
2. **MCP**: tools to list comments and reply (agent-first, no UI needed).
3. **UI**: inbox to display comments and reply from Postiz.

Not to be confused with what already exists: the `Comments` Prisma model and
`/public/posts/:id/comments` are *internal team review notes* on the preview
page, and provider `comment()` methods post *our own* follow-up comments at
publish time. Neither reads audience comments. Keep the new feature separate
(new model, new names) to avoid rebase conflicts with upstream.

## Platform scope

| Platform | Read | Reply | Scope status | Phase |
|---|---|---|---|---|
| Instagram (standalone) | `GET /{media-id}/comments` | `POST /{comment-id}/replies` | `instagram_business_manage_comments` already requested | 1st |
| Threads | `GET /{media-id}/replies` (or `/conversation`) | `POST /me/threads` with `reply_to_id` + publish | `threads_manage_replies` already requested | 1st |
| X | search `conversation_id:<tweet_id>` | `POST /2/tweets` with `reply` | Reading needs a paid API tier: check our plan's limits | later |
| TikTok | none in the Content Posting API | none | Needs separate TikTok Business / Research API approval | out of scope |
| WordPress | REST `/wp/v2/comments?post=` | `POST /wp/v2/comments` with `parent` | app password already has access | optional |

### Instagram (standalone) notes

Confirmed: `instagram_business_manage_comments` belongs to the Instagram API
with Instagram Login, which is exactly what `instagram.standalone.provider.ts`
uses (`graph.instagram.com`, no Facebook Page needed). Meta's
[overview](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/overview)
lists getting, replying to, deleting, hiding and disabling comments on the
account's own media. Our setup guide (`../docs/instagram.md`, step 3) already
adds the scope to the Meta app.

Endpoints (all on `https://graph.instagram.com/<version>`):

- `GET /{media-id}/comments`: comments on a post (request `id,text,timestamp,username,like_count,replies{...}`).
- `GET /{comment-id}/replies`: replies under a comment.
- `POST /{comment-id}/replies?message=...`: reply (returns the new comment id).
- Later, if wanted: `POST /{comment-id}?hide=true`, `DELETE /{comment-id}`.

Things to handle:

- **Token scopes**: a token only carries the scopes accepted at connect time.
  First step of Phase 1: with the VOID9 token, call `GET /{media-id}/comments`
  on a real post. On a permission error, reconnect the channel. In the code,
  map that error to a clear "reconnect the channel to enable comments" message
  instead of failing silently.
- **Commenter usernames**: since Aug 27, 2024 the `username` of a commenter
  requires this scope. Store `username` as nullable anyway.
- **Development mode**: our Meta app stays in Development mode, so this works
  for accounts with an app role (VOID9). Outside users would need Meta App
  Review for this scope (screencast of the inbox flow, so the UI phase would be
  needed for review).
- **Rate limit**: about 200 calls per hour per account. At a 5 min interval
  (12 runs/hour) that's about 16 calls per run, so the lookback and age tiers
  below matter. Read Meta's usage headers and back off when close to the limit.
- **Media id**: the comments endpoint needs the IG media id. Check whether the
  standalone provider stores it on publish (it may only store the permalink in
  `Post.releaseURL`). If not, save it at publish time.
- **Webhooks** (later): Instagram Login apps can subscribe to the `comments`
  webhook field, which would replace polling for Instagram.

Open question for Threads: is `threads_manage_replies` approved/accepted on
our current token? Same check as Instagram (call the replies endpoint with the
stored token before building on it).

## Phase 1: Fetch

### Data model (`libraries/nestjs-libraries/src/database/prisma/schema.prisma`)

New model, e.g. `SocialComment`:

- `id`, `organizationId`, `integrationId`, `postId` (our `Post`, nullable for
  comments on posts not made through Postiz, which we skip at first)
- `externalId` (platform comment id), `externalParentId` (for threaded replies)
- `externalPostId` (the platform media/tweet id, from `Post.releaseURL` / stored id)
- `authorName`, `authorHandle`, `authorAvatar`, `content`, `createdAt` (platform time)
- `fromUs` (bool, our own replies, so they're shown but not counted as unread)
- `status`: `NEW | READ | REPLIED | HIDDEN`
- `repliedAt`, `replyExternalId`
- `fetchedAt`, `deletedAt`
- `@@unique([integrationId, externalId])` for idempotent upserts
- indexes on `(organizationId, status, createdAt)` and `(postId)`

Check how the post's platform id is stored today (`Post.releaseURL`, and
whether the published media id is persisted anywhere). If only the URL is
stored, persist the id at publish time or parse it from the URL.

### Provider interface

Optional methods on the social provider interface
(`libraries/nestjs-libraries/src/integrations/social/social.integrations.interface.ts`),
so only providers that support it implement them:

```ts
fetchComments?(
  accessToken: string,
  externalPostId: string,
  since?: Date,
  integration?: Integration
): Promise<FetchedComment[]>;

replyToComment?(
  accessToken: string,
  externalCommentId: string,
  externalPostId: string,
  message: string,
  integration?: Integration
): Promise<{ externalId: string; url?: string }>;
```

Implement for `instagram.standalone.provider.ts` and `threads.provider.ts`
first. Reuse `SocialAbstract.fetch` (rate-limit and refresh handling) and the
existing token-refresh behaviour.

### Scheduler (Temporal, `apps/orchestrator`)

Follow the existing long-running workflow pattern (`missing.post.workflow.ts`,
started from `libraries/nestjs-libraries/src/temporal/infinite.workflow.register.ts`
when `RUN_CRON` is set, and `continueAsNew` like `digest.email.workflow.ts`):

- `fetchCommentsWorkflow`: loop `sleep(interval)`, call an activity that
  picks the posts to poll, fetches, and upserts. `continueAsNew` every N loops
  to keep history small.
- Activity in `apps/orchestrator/src/activities/` (new `comments.activity.ts`)
  that calls a `SocialCommentsService` in nestjs-libraries.
- Respect `POSTIZ_ACTIVE_PROVIDERS`: skip providers that aren't active.
- Per-provider concurrency via the existing `maxConcurrentJob`.

### Frequency: env var

Polling every 5 min makes sense for Instagram/Threads (Meta's limits are per
user per hour and we have few posts). It does **not** make sense for X on a
low tier. So:

- `SOCIAL_COMMENTS_FETCH_INTERVAL`: default `5m` (parsed with `ms`, same lib
  the code already uses). `0` or unset with `SOCIAL_COMMENTS_ENABLED!=true`
  disables the workflow entirely.
- `SOCIAL_COMMENTS_ENABLED`: feature flag, default `false`, so the image can
  ship before we've tested it.
- `SOCIAL_COMMENTS_LOOKBACK_DAYS`: only poll posts published in the last N
  days (default `14`). Older posts rarely get comments and would burn quota.
- Optional later: per-provider override, e.g. `SOCIAL_COMMENTS_FETCH_INTERVAL_X=1h`.

Polling tiers to cut API calls: posts < 48 h old every interval, older posts
in the lookback window every 6th run. Track `lastCommentsFetchAt` per post.

Webhooks (Meta supports comment webhooks for Instagram) would be better than
polling long-term, but need a public verified callback and app review: keep
polling as the base, consider webhooks later.

Add the env vars to `.env.example` and the parent repo's `docker-compose.yml`.

### Done when

- With the flag on, comments on a test Instagram and Threads post appear in
  the DB within one interval, re-runs don't duplicate them, deleted comments
  get `deletedAt`.
- Expired token marks the channel for reconnect (existing behaviour), and the
  loop keeps going for other channels.

## Phase 2: MCP

New tools in `libraries/nestjs-libraries/src/chat/tools/`, registered in
`tool.list.ts`:

- `commentsListTool`: filter by `status` (default `NEW`), `integrationId`,
  `postId`, date window, limit. Returns comment, author, post snippet, channel,
  thread parent, and whether we already replied.
- `commentReplyTool`: `commentId` + `message`. Calls `replyToComment`, stores
  our reply as a `SocialComment` with `fromUs=true`, sets the original to
  `REPLIED`. Tool description must tell agents to confirm the reply text with
  the user before sending (human in the loop, same as Postiz's own guidance).
- `commentMarkTool`: set `READ` / `HIDDEN` (local only, doesn't touch the
  platform).
- Optionally `commentsFetchNowTool`: trigger an immediate fetch for one
  post/channel, rate-limited.

Rules to put in the tool descriptions: platform reply length limits (Instagram
2200, Threads 500), no links in Instagram replies if they get filtered, never
reply to `fromUs` comments.

Also expose the same via the public API (`apps/backend/src/api/routes/public.controller.ts`)
so the CLI and scripts can use it.

Note for Kiro: tools with only optional array params may get empty arrays
dropped (seen with `triggerTool`'s `dataSchema`). Keep inputs flat/optional.

### Done when

- From Kiro: "list new comments", "reply to <comment> with ...", and the reply
  shows up on Instagram and Threads under the right comment.
- Posting a reply needs explicit approval in Kiro (no auto-approve).

## Phase 3: UI (display and reply)

- New "Inbox" / "Comments" page in `apps/frontend` (sidebar item next to
  Launches), list grouped by post, filter by channel and status, unread badge.
- Comment thread view: original post preview, comments, inline reply box with
  the platform's char limit, our replies marked.
- Optional: show a comment count on published posts in the calendar/preview.
- Backend routes in `apps/backend/src/api/routes/` (authenticated, org-scoped,
  `CheckPolicies` like the other routes).
- Optional AI "suggest reply" using the existing copilot.
- Notification (existing notifications service) when new comments arrive,
  with the digest email as an option.

### Done when

- Comments appear without a page reload after a fetch (poll the API or SWR
  refresh), reply from the UI posts to the platform, statuses update.
- Screenshots in light and dark mode (as with the other fork features).

## Cross-cutting

- Org isolation: every query filtered by `organizationId`; replies must check
  the comment's integration belongs to the caller's org.
- Privacy: comments contain third-party personal data. Mention it on
  `/privacy`, delete stored comments when a channel is disconnected, and don't
  keep them forever (retention env var, e.g. `SOCIAL_COMMENTS_RETENTION_DAYS=90`).
- Rebase safety: new files where possible; touch shared files (`schema.prisma`,
  `tool.list.ts`, interface, `infinite.workflow.register.ts`) minimally, and
  list them in `UPSTREAM.md`.
- Tests: provider `fetchComments` / `replyToComment` with mocked HTTP; upsert
  idempotency; MCP tool input validation.
