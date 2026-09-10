import type { BackupDestinationId } from "dwc-config-backup-core";

export const PLUGIN_MANIFEST_ID = "DuetConfigBackup"; // == plugin.json "id"
export const PLUGIN_ID = "duetConfigBackup"; // camelCase - i18n key prefix "plugins.duetConfigBackup.*"
export const ROUTE_PATH = "/Plugins/DuetConfigBackup";
export const DOCS_URL = "https://github.com/jaysuk/duet-config-backup-plugin";

/** Every destination the Create tab offers, in display order. */
export const DESTINATION_IDS: Array<BackupDestinationId> = ["local", "duet", "github", "drive", "dropbox", "webdav"];

/** The Restore tab's cloud source picker - the same set and ORDER as the Create tab minus "local"
 *  (Restore handles a local zip as its own separate option). Derived, not hand-maintained, so the two
 *  pickers can't drift apart again (they had, with Drive appended to the end of one but not the other). */
export type CloudSourceId = Exclude<BackupDestinationId, "local">;
export const CLOUD_SOURCE_IDS: Array<CloudSourceId> = DESTINATION_IDS.filter((id): id is CloudSourceId => id !== "local");

/** i18n keys for each destination's display label - shared between `BackupCreatePanel.vue` (the
 * destination picker) and `runBackup.ts` (error messages like "GitHub isn't configured yet"), so both
 * agree on the exact same wording. */
export const DESTINATION_LABEL_KEYS: Record<BackupDestinationId, string> = {
	local: "plugins.duetConfigBackup.configBackup.create.destinationLocal",
	duet: "plugins.duetConfigBackup.configBackup.create.destinationDuet",
	github: "plugins.duetConfigBackup.configBackup.create.destinationGithub",
	drive: "plugins.duetConfigBackup.configBackup.create.destinationDrive",
	dropbox: "plugins.duetConfigBackup.configBackup.create.destinationDropbox",
	webdav: "plugins.duetConfigBackup.configBackup.create.destinationWebdav",
};

/**
 * This plugin's own SD-card state file, protected from Mirror-mode deletion. There isn't one today -
 * all persistent state is either localStorage (destination settings/credentials, via
 * dwc-config-backup-core's own namespace) or the shared `0:/sys/flexible-layouts.credentials.json`
 * SD-sync file the core package itself already protects. Kept as an explicit (currently empty) set
 * rather than omitted, so a future on-SD state file has an obvious place to be added.
 */
export const PROTECTED_SD_FILES: ReadonlySet<string> = new Set();
