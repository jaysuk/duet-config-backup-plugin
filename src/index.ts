import { isPluginLoaded, registerPluginMessages, registerRoute, unregisterRoute } from "@/plugins";
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
			// This is a viewport-filling page (see ConfigBackupPage.vue's dwc-page-fill wrapper) -
			// matches DWC's own pageFill convention (Settings, HeightMap, ObjectModelBrowser, ...),
			// which cross-page scrollBehavior reads to decide whether to land at the page's bottom.
			pageFill: true,
			// Flexible Layouts ("FlexibleLayouts", its plugin.json id - hardcoded rather than imported,
			// since these are two independently-published plugin repos with no shared constants module)
			// has this exact feature built in. If both happen to be installed, defer to FL's copy rather
			// than showing two identical nav entries - `condition` is evaluated reactively at render
			// time (not just once at registration), so this is correct regardless of which plugin's
			// index.ts happens to run first during boot; by the time the nav drawer actually renders,
			// every installed plugin has already finished loading either way.
			condition: () => !isPluginLoaded("FlexibleLayouts"),
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
