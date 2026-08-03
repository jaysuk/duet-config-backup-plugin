# Duet Config Backup

Whole-machine configuration backup & restore for DuetWebControl 3.7, as a standalone plugin — the
same feature that ships inside [Flexible Layouts](https://github.com/jaysuk/Flexible-Layouts), for
anyone who wants it without the rest of that plugin.

See [docs.md](docs.md) for the full feature reference (what's backed up, redaction rules, restore
modes, destinations, credential storage).

## Install

Settings → General → Plugins → Install plugin, then find it under **Plugins → Duet Config Backup**
(`/Plugins/DuetConfigBackup`).

## Building the plugin ZIP yourself

If you're not installing a pre-built release, DWC's own `build-plugin` script needs this repo's
dependencies installed FIRST - it does not install them for you:

```bash
git clone https://github.com/jaysuk/duet-config-backup-plugin.git
cd duet-config-backup-plugin
npm install                                       # pulls dwc-config-backup-core, dwc-plugin-runtime, jszip

cd /path/to/DuetWebControl                        # a DWC 3.7 checkout
npm run build-plugin -- /path/to/duet-config-backup-plugin
```

Skipping `npm install` fails with `globals option: The function returned undefined, but expected
string` - the build script can't find the unresolved imports, since they were never installed.

Two of this plugin's dependencies (`dwc-config-backup-core`, `dwc-plugin-runtime`) install directly
from GitHub rather than npmjs.org, so `npm install` needs working `git` access - if your network/CI
policy blocks direct git fetches, that step will fail even though the command itself is correct.

## Relationship to Flexible Layouts

This plugin and Flexible Layouts' own backup feature share one implementation —
[`dwc-config-backup-core`](https://github.com/jaysuk/dwc-config-backup-core) — so a backup made by
one restores cleanly on the other, and on the DWC 3.6 build of this same plugin. Only the DWC-facing
plumbing (machine I/O binding, route registration, i18n) is duplicated per host.

Two things worth knowing if you run this alongside Flexible Layouts on the same printer:

- **Saved destination credentials are NOT shared** — each uses its own `localStorage` namespace, so
  installing both doesn't mean re-typing a GitHub token twice by accident, or auto-sharing it if you
  wouldn't want to. Move credentials between them deliberately via the SD-card sync or the
  export/import file, both under the Configuration tab's "Credential storage & encryption" section.
- **The SD-card credential sync file IS shared** (`0:/sys/flexible-layouts.credentials.json`) — it's
  the same encrypted-bundle format regardless of which host wrote it, by design, so either host can
  load what the other saved there.

## Development

```bash
npm install
npm test                                          # vitest — no DWC checkout needed
DWC_DIR=/path/to/DuetWebControl npm run typecheck
DWC_DIR=/path/to/DuetWebControl npm run verify-build
```

Business logic (archive format, redaction, restore planning, destination adapters) lives in
`dwc-config-backup-core`, not here — see that repo to change any of it. This repo is the DWC-facing
shell: 12 Vue components (copied from Flexible Layouts' `src/configBackup/`, then adjusted for a
standalone i18n namespace and `PLUGIN_MANIFEST_ID`), plus the three small pieces of host wiring the
core package can't provide itself (`src/model/machineIO.ts`, `src/model/autoBackupNudges.ts`,
`src/model/constants.ts`).

## License

GPL-3.0-or-later, inherited from Flexible Layouts, which this plugin's UI was extracted from.
