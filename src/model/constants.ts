export const PLUGIN_MANIFEST_ID = "DuetConfigBackup"; // == plugin.json "id"
export const PLUGIN_ID = "duetConfigBackup"; // camelCase - i18n key prefix "plugins.duetConfigBackup.*"
export const ROUTE_PATH = "/Plugins/DuetConfigBackup";
export const DOCS_URL = "https://github.com/jaysuk/duet-config-backup-plugin";

/**
 * This plugin's own SD-card state file, protected from Mirror-mode deletion. There isn't one today -
 * all persistent state is either localStorage (destination settings/credentials, via
 * dwc-config-backup-core's own namespace) or the shared `0:/sys/flexible-layouts.credentials.json`
 * SD-sync file the core package itself already protects. Kept as an explicit (currently empty) set
 * rather than omitted, so a future on-SD state file has an obvious place to be added.
 */
export const PROTECTED_SD_FILES: ReadonlySet<string> = new Set();
