# V9 Social: upstream sync

V9 Social is a light fork of [Postiz](https://github.com/gitroomhq/postiz-app).
Branch `v9` = an upstream release tag + a small patch stack on top.

- `origin`   → https://github.com/Badokas/v9-social (default branch `v9`)
- `upstream` → https://github.com/gitroomhq/postiz-app
- Current base: `v2.25.0 + 90` (merge-base `git describe` = `v2.25.0-90-gafa30c65`;
  update this line on every rebase). Upstream's last published *git tag* is
  `v2.25.0` — there is no `v2.25.1` tag to fetch, so our `-v9.<n>` releases that
  read `v2.25.1-…` carry a hand-bumped upstream label, not a real upstream tag.
- Current release tag: `v2.25.1-v9.3` (bump `-v9.<n>` on every build)
- Patch stack: **24 commits ahead** of `upstream/main`, **45 behind** (as of
  upstream `91c91f63`, 2026-10-09). Rebasing the stack onto `upstream/main`
  currently replays with **2 conflicting commits across 4 files** — all known
  and scripted below under "Known conflict points". Re-measure with
  `git rev-list --left-right --count upstream/main...v9`.

## Updating to a new upstream release

```sh
git fetch upstream --tags
git tag --sort=-v:refname | head        # pick the new tag, e.g. v2.26.0
git checkout v9
git rebase --onto <new-tag> <old-tag> v9   # replay our patches only
# or: git merge <new-tag>
# resolve conflicts, then rebuild/test
git push --force-with-lease origin v9      # rebase only; merge needs a plain push
```

Then let GitHub Actions rebuild and publish the image, and redeploy.

## Dry-run the rebase first

Always test the rebase on a throwaway branch before touching `v9`:

```sh
git fetch upstream
git checkout -b rebase-test v9
git rebase upstream/main              # or the target release tag
npx tsc -p apps/frontend/tsconfig.json --noEmit   # verify it still type-checks
# (optionally) pnpm build:frontend    # full build if you want certainty
git checkout v9 && git branch -D rebase-test      # clean up; v9 untouched
```

A clean dry-run means the real rebase is safe. If it conflicts, the conflicts
are almost always in the inline-hex spots or `tiktok:` files listed below.

## Patch-stack convention

Keep commits small and isolated, prefixed by group:

- `ci:` GitHub Actions / GHCR image publishing
- `branding:` V9 Social rebrand (name, logos, ToS/privacy links)
- `theme:` brand color / accent changes
- `feat:` fork-only features (e.g. public legal pages)
- `tiktok:` TikTok UX compliance fixes

Rules to keep merges cheap:

- Touch as few upstream files as possible; prefer adding new files/assets.
- Don't reformat unrelated code.
- The repo page shows our `.github/README.md` (GitHub prefers it over the
  root one); leave upstream's root `README.md` untouched.
- Don't edit every i18n locale; change English/visible defaults only.
- Don't edit upstream `.github/workflows/*`; disable unwanted ones on the
  fork with `gh workflow disable` and add our own workflow files instead.
- **Recolor through the `brand` token, not inline hex.** The accent lives in
  one place: `--new-btn-primary` / `--new-btn-primary-rgb` in
  `apps/frontend/src/app/colors.scss`, exposed as the `brand` Tailwind token in
  `tailwind.config.cjs`. Use `bg-brand`, `border-brand`, `text-brand`,
  `bg-brand/50`, etc. Never reintroduce `bg-[#612BD3]`-style literals — they
  duplicate the value and each one is a future rebase conflict.
- A few spots can't use the token (SVG `stroke`/`fill`, React `color=` props,
  the `scrollbar-thumb-[#...]` plugin class, CSS-in-string chat widgets). These
  carry the raw brand hex and are the most likely line-level rebase conflicts.
  Known locations: `apps/frontend/src/components/ui/icons/index.tsx`,
  `.../layout/loading.tsx`, `.../layout/check.payment.tsx`,
  `.../settings/signatures.component.tsx`, `.../autopost/autopost.tsx`,
  `libraries/nestjs-libraries/src/chat/ui/{clipping,upload}.widget.ts`,
  and `.../analytics/chart-social.tsx` (inline `rgba()`).

The brand-token convention keeps most of the recolor patch rebasing cleanly:
on the last dry-run (24-commit stack onto `upstream/main`, 45 commits past the
merge-base), only **2 of 24 commits conflicted**, in **4 files total**, and the
rebased tree type-checked (`npx tsc -p apps/frontend/tsconfig.json --noEmit`).
All four conflicts are documented with their resolution under "Known conflict
points" below. Re-run the dry-run (see "Dry-run the rebase first" above) before
any real upgrade and update that section if the set changes.

## Known conflict points (scripted resolution)

These are the only spots the dry-run rebase conflicted on. Each is a case where
upstream edited a line the patch stack also touches. Resolutions below so the
next upgrade is mechanical; re-check after each sync and prune entries once
upstream and the patch stack stop colliding.

### 1. `plugs/` and `third-party/` → upstream turned them into redirects

- Commit: `branding: V9 Social logos, titles and Powered by Postiz notice`
- Files: `apps/frontend/src/app/(app)/(site)/plugs/page.tsx`,
  `apps/frontend/src/app/(app)/(site)/third-party/page.tsx`
- Cause: the branding patch set a V9 Social `metadata.title` on these pages.
  Upstream replaced both page bodies with a bare
  `redirect('/settings?tab=plugs')` / `redirect('/settings?tab=integrations')`,
  so the page no longer renders a `<head>` and the `metadata` export is dead.
- **Resolution: take upstream's version verbatim — drop the fork's `metadata`
  block and the old component import.** The title no longer renders anywhere;
  the real settings pages own their own titles. This drops the branding on
  these two titles permanently (acceptable — users never see a redirect's head).

### 2. `public.component.tsx` → upstream removed the Developers/API sub-tabs

- Commit: `theme: route brand accent through a single Tailwind token`
- File: `apps/frontend/src/components/public-api/public.component.tsx`
- Cause: the theme patch is a pure `bg-[#612BD3]` → `bg-brand` recolor across
  the whole file. Most hunks replay clean. The one conflict is in
  `PublicComponent`, where the fork's base had an `api`/`developer` sub-tab
  switcher (`subTab`, `setSubTab`, `<DeveloperComponent/>`) that the recolor
  patch had recolored; upstream has since **deleted that switcher**, collapsing
  the body to `<h3>{t('agents','Agents')}</h3><PublicApiContent/>`.
- **Resolution: take upstream's collapsed body (the HEAD side).** It has no
  brand literal in that region, so there is nothing to recolor there. Afterwards
  confirm no stray literal survived elsewhere in the file:
  `grep -n 612BD3 apps/frontend/src/components/public-api/public.component.tsx`
  must return nothing (the clean recolor hunks cover the `McpSection`/
  `CliSection` buttons). Upstream keeps adding `bg-[#612BD3]` buttons here, so
  if that grep ever finds one, recolor it to `bg-brand` by hand.

### 3. `calendar.tsx` → brand token meets a new upstream class

- Commit: `theme: route brand accent through a single Tailwind token`
- File: `apps/frontend/src/components/launches/calendar.tsx`
- Cause: the recolor changed `border border-[#612BD3]` → `border border-brand`
  on the drag-drop cell; upstream added a sibling
  `display === 'month' && 'mobile:min-h-[44px]'` class on the adjacent line.
- **Resolution: keep both — upstream's new `display === 'month'` line *and* the
  fork's `border border-brand`.** This is the textbook brand-token conflict the
  convention above warns about: resolve by taking the union, never by reverting
  to the hex literal.

Procedure for the real rebase, start to finish:

```sh
git fetch upstream --tags
git checkout -b rebase-test v9
git rebase upstream/main
# conflict 1 (branding): take upstream for plugs/ + third-party/ page.tsx
# conflict 2+3 (theme):  take upstream body in public.component.tsx;
#                        union-resolve calendar.tsx (keep new line + border-brand)
git add <files> && git rebase --continue
npx tsc -p apps/frontend/tsconfig.json --noEmit     # must exit 0
git checkout v9 && git branch -D rebase-test        # if only dry-running
```

## Temporal worker allowlist (`POSTIZ_ACTIVE_PROVIDERS`)

`feat:` patch porting upstream [PR #1651](https://github.com/gitroomhq/postiz-app/pull/1651)
(for issue #1570) ahead of its merge. Without it, `getTemporalModule` starts a
worker per provider (~32) regardless of what's configured, burning idle CPU/RAM.

`POSTIZ_ACTIVE_PROVIDERS` is a comma-separated allowlist; unset => all providers
(backwards-compatible). Match is on the **task queue** = `identifier.split('-')[0]`,
so use base names: `instagram` (covers `instagram-standalone`), `tiktok` (covers
`tiktok-business`). Our deploy uses `tiktok,instagram,threads,x,wordpress` → 6
workers instead of 32.

File touched (rebase conflict lands here): `libraries/nestjs-libraries/src/temporal/temporal.module.ts`.
Our version also carries fork-only `EXCLUDE_QUEUE` / `WORKER_CONCURRENCY_DIVIDER`
logic, so the PR did not apply cleanly — the allowlist was merged into the
existing `.filter()`. **When upstream merges #1651, drop our version of this hunk
in favor of theirs** (then re-add our EXCLUDE_QUEUE/divider logic if it isn't
upstream yet).

## Upstream workflows disabled on the fork

Disable with `gh workflow disable <file> -R Badokas/v9-social` (files left
untouched). GitHub only registers a workflow after its first trigger fires
(scheduled ones within ~10–30 min of the push), so disable each once it shows
up in `gh workflow list`:

- `build-containers.yml` (pushes to `ghcr.io/gitroomhq`, triggers on any tag)
- `build-extension.yaml`, `publish-extension.yml` (upstream extension secrets)
- `staging-conflicts.yml` (scheduled, upstream staging/Claude secrets)
- `stale.yml` (scheduled issue/PR bot)
- `issue-label-triggers.yml` (upstream issue bot)
- `codeql.yml` (only on `main`, which we don't use)

Left enabled: `build.yml` (plain build check on push/PR).
`.github/workflows/eslint` has no `.yml` extension, so GitHub ignores it.
New upstream workflows show up enabled after a sync; check
`gh workflow list -R Badokas/v9-social` and disable as needed.

## Docker image

`.github/workflows/v9-docker.yml` builds `Dockerfile.dev` (linux/amd64) and
pushes `ghcr.io/badokas/v9-social` with tags:

- `v9`: latest push to branch `v9`
- `sha-<short>`: every build
- `v<upstream>-v9.<n>`: release tags, e.g. `v2.25.0-v9.3`
- `latest`: moved to the newest release-tag build (tag pushes only)

Release: `git tag v2.25.0-v9.<n> && git push origin v2.25.0-v9.<n>`.
Each release-tag build publishes both the immutable `v<upstream>-v9.<n>` tag
and moves `latest` to it. Pin production (`docker-compose.yml`) to the
immutable tag for reproducible deploys; use `latest` only where you want to
auto-follow the newest build.
Make the GHCR package public once in the GitHub UI (package settings).
Keep `build-containers.yml` disabled: it fires on every tag.

## TikTok patches

`tiktok:` commits implement TikTok's
[Direct Post UX guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines)
for the legacy `tiktok` provider. `tiktok-business` shares the composer, so it
also gets no privacy default, unchecked interactions and the new
labels/declaration, but no creator_info, blocking or Direct Post-only.

Scopes: `user.info.basic`, `user.info.profile` (username for release URLs),
`user.info.stats` and `video.list` (upstream's unchanged `analytics()`,
`postAnalytics()` and `missing()`), `video.publish` (creator_info, Direct Post
init, publish status/release URL). Dropped, with consequences:

- `video.upload`: UPLOAD (send to TikTok inbox) is rejected for `tiktok`.
  The portal lists it anyway (bundled with Content Posting API, can't be
  removed); the app review form says it isn't requested.

TikTok channels connected while the fork asked for 3 scopes keep their old
token: connect the same account again (Add Channel → TikTok updates the
existing channel) before analytics work for them.

Behavior: creator_info is shown in the composer and re-checked before each
publish; no `PUBLIC_TO_EVERYONE` fallback; `/posts/valid` rejects missing
privacy, disclosure without a brand choice, branded + `SELF_ONLY`, UPLOAD and
the composer's `publish_blocked_reason` (can't post now, video too long).
Duet / Stitch / AI label are hidden (not unmounted) for photo posts, and
`duet` / `stitch` are `@IsOptional` in the DTO, so photo posts don't fail
with "duet must be a boolean value".

Files touched (where rebase conflicts land):

- `libraries/nestjs-libraries/src/integrations/social/tiktok.provider.ts`
- `libraries/nestjs-libraries/src/dtos/posts/providers-settings/tiktok.dto.ts`
- `apps/frontend/src/components/new-launch/providers/tiktok/tiktok.provider.tsx`
- `libraries/react-shared-libraries/src/form/checkbox.tsx` (real `disabled`)

## Public site

`feat:` fork-only marketing pages for signed-out visitors (TikTok app review
needs a real public website on the app's domain): `/`, `/channels/tiktok`,
`/channels/instagram`, `/ai-agents` (the app already owns `/agents`),
`/pricing`. `/terms` and `/privacy` share the same header/footer.
Content is plain English in `components/v9/site/site.data.ts`; public contact
is `hey@void9.com` (legal contact stays on the legal pages). Add a channel by
adding an entry to `CHANNELS`.

Signed-in users hitting `/` and `/?org=` invites keep the upstream redirects.

Artwork is original and generated: the scenes in `assets/site-media/scenes`
render to `apps/frontend/public/v9social/site` via `assets/site-media/render.mjs`
(needs ffmpeg, ImageMagick and playwright-core; see the header of that file).
Each channel page shows a looping composer video of its own post settings
(`v9-tiktok-settings`, `v9-instagram-settings`).

Files: new `apps/frontend/src/app/(app)/(public)/**`,
`apps/frontend/src/components/v9/site/*` and `assets/site-media/**`; upstream
files touched: `apps/frontend/src/proxy.ts` (public-path allowlist) and
`apps/frontend/src/components/ui/logo-text.component.tsx` (optional
`className` so the site header can scale the wordmark down on mobile).

## Logout with `NOT_SECURED`

`fix:` upstream bug (since `6ba1ab91`, "feat: not secured"). With
`NOT_SECURED=true` the login response stores `auth` twice: a cookie with
`Domain=<FRONTEND_URL domain>` from the backend `Set-Cookie`, and a host-only
copy written by `setCookie()` from the `auth` response header. Upstream's
`LogoutComponent` only cleared the host-only copy in the browser, so the
Domain cookie survived and `/` sent the user straight back to the app.
Our `LogoutComponent` always calls `POST /user/logout` (its `Set-Cookie`
matches the Domain cookies) and then clears the host-only copies.

File touched: `apps/frontend/src/components/layout/logout.component.tsx`.
Drop this patch if upstream fixes logout for non-secured mode.
