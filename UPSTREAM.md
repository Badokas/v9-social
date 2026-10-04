# V9 Social: upstream sync

V9 Social is a light fork of [Postiz](https://github.com/gitroomhq/postiz-app).
Branch `v9` = an upstream release tag + a small patch stack on top.

- `origin`   → https://github.com/Badokas/v9-social (default branch `v9`)
- `upstream` → https://github.com/gitroomhq/postiz-app
- Current base: `v2.25.0` (update this line on every rebase)
- Current release tag: `v2.25.0-v9.3` (bump `-v9.<n>` on every build)

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

A test rebase of the full patch stack onto a 19-commit-ahead `upstream/main`
replayed with zero conflicts, so this convention is working. Re-run the
dry-run (see "Dry-run the rebase first" above) before any real upgrade.

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
`video.publish` (creator_info, Direct Post init, publish status/release URL).
Dropped, with consequences:

- `video.upload`: UPLOAD (send to TikTok inbox) is rejected for `tiktok`.
- `user.info.stats`, `video.list`: TikTok `analytics()`, `postAnalytics()`
  and `missing()` return empty (verified they degrade to `[]`, no
  refresh/disconnect).

Behavior: creator_info is shown in the composer and re-checked before each
publish; no `PUBLIC_TO_EVERYONE` fallback; `/posts/valid` rejects missing
privacy, disclosure without a brand choice, branded + `SELF_ONLY`, UPLOAD and
the composer's `publish_blocked_reason` (can't post now, video too long).

Files touched (where rebase conflicts land):

- `libraries/nestjs-libraries/src/integrations/social/tiktok.provider.ts`
- `libraries/nestjs-libraries/src/dtos/posts/providers-settings/tiktok.dto.ts`
- `apps/frontend/src/components/new-launch/providers/tiktok/tiktok.provider.tsx`
- `libraries/react-shared-libraries/src/form/checkbox.tsx` (real `disabled`)
