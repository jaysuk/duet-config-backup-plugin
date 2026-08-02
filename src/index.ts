import { registerPluginMessages, registerRoute, unregisterRoute } from "@/plugins";
import Events from "@/utils/events";
import { installErrorCapture } from "dwc-plugin-runtime";
import { configureHost } from "dwc-config-backup-core";

import ConfigBackupPage from "./components/ConfigBackupPage.vue";
import { PLUGIN_ID, PLUGIN_MANIFEST_ID, PROTECTED_SD_FILES, ROUTE_PATH } from "./model/constants";
import { installAutoBackupNudges, uninstallAutoBackupNudges } from "./model/autoBackupNudges";
import en from "./i18n/en.json";

registerPluginMessages(PLUGIN_ID, { en });

// A distinct namespace from Flexible Layouts' "flexibleLayouts.configBackup" - this is a standalone
// plugin and may be installed alongside FL, so the two must not silently share saved destination
// credentials. Anyone who genuinely wants to move credentials between the two can already do so via
// the SD-card sync / export-import file, which round-trips regardless of namespace.
configureHost({
	storageNamespace: "duetConfigBackup",
	protectedFiles: PROTECTED_SD_FILES,
});

registerRoute(ConfigBackupPage, {
	Plugins: {
		DuetConfigBackup: {
			icon: "mdi-archive-arrow-down",
			caption: "plugins.duetConfigBackup.configBackup.title",
			path: ROUTE_PATH,
		},
	},
});

const uninstallErrorCapture = installErrorCapture();
installAutoBackupNudges();

function onPluginUnloaded(id: string): void {
	if (id === PLUGIN_MANIFEST_ID) {
		unregisterRoute(ROUTE_PATH);
		uninstallAutoBackupNudges();
		uninstallErrorCapture();
		Events.off("dwcPluginUnloaded", onPluginUnloaded);
	}
}
Events.on("dwcPluginUnloaded", onPluginUnloaded);
