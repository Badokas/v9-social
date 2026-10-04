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
