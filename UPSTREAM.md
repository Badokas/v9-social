# V9 Social: upstream sync

V9 Social is a light fork of [Postiz](https://github.com/gitroomhq/postiz-app).
Branch `v9` = an upstream release tag + a small patch stack on top.

- `origin`   → https://github.com/Badokas/v9-social (default branch `v9`)
- `upstream` → https://github.com/gitroomhq/postiz-app
- Current base: `v2.25.0` (update this line on every rebase)

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

## Patch-stack convention

Keep commits small and isolated, prefixed by group:

- `ci:` GitHub Actions / GHCR image publishing
- `branding:` V9 Social rebrand (name, logos, ToS/privacy links)
- `tiktok:` TikTok UX compliance fixes

Rules to keep merges cheap:

- Touch as few upstream files as possible; prefer adding new files/assets.
- Don't reformat unrelated code.
- Don't edit every i18n locale; change English/visible defaults only.
- Don't edit upstream `.github/workflows/*`; disable unwanted ones on the
  fork with `gh workflow disable` and add our own workflow files instead.

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
- `v<upstream>-v9.<n>`: release tags, e.g. `v2.25.0-v9.1`

Release: `git tag v2.25.0-v9.1 && git push origin v2.25.0-v9.1`.
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
