<template>
	<div class="cb-page dwc-page-fill">
		<v-container fluid class="py-4 cb-container">
			<div class="d-flex align-center mb-4 flex-shrink-0">
				<v-icon size="large" class="me-3">mdi-archive-arrow-down</v-icon>
				<div class="text-title-medium">{{ $t("plugins.duetConfigBackup.configBackup.title") }}</div>
				<v-spacer />
				<v-btn icon="mdi-help-circle-outline" variant="text" :title="$t('plugins.duetConfigBackup.help.title')" @click="openHelpAt('')" />
				<v-btn icon="mdi-information-outline" variant="text" title="About, version & diagnostics" @click="aboutOpen = true" />
			</div>

			<v-tabs v-model="tab" class="mb-3 flex-shrink-0">
				<v-tab value="create">{{ $t("plugins.duetConfigBackup.configBackup.tabs.create") }}</v-tab>
				<v-tab value="restore">{{ $t("plugins.duetConfigBackup.configBackup.tabs.restore") }}</v-tab>
				<v-tab value="cloud">{{ $t("plugins.duetConfigBackup.configBackup.tabs.cloud") }}</v-tab>
			</v-tabs>

			<v-window v-model="tab" :touch="false" :transition="false" :reverse-transition="false" class="cb-window">
				<v-window-item value="create"><BackupCreatePanel :active="tab === 'create'" /></v-window-item>
				<v-window-item value="restore"><RestorePanel :active="tab === 'restore'" /></v-window-item>
				<v-window-item value="cloud"><CloudPanel @help="openHelpAt" /></v-window-item>
			</v-window>
		</v-container>

		<ConfigBackupHelpDialog v-model="helpOpen" :section="helpSection" />

		<AboutDialog v-model="aboutOpen" :plugin-id="PLUGIN_MANIFEST_ID" title="Duet Config Backup"
					 description="Whole-machine configuration backup & restore - the same feature that ships inside Flexible Layouts, as its own standalone plugin."
					 :model="machineStore.model" :repo="DOCS_URL" :docs-url="`${DOCS_URL}/blob/main/docs.md`"
					 :diagnostic-state="{ activeTab: tab }" :show-updates="false" />
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { AboutDialog } from "dwc-plugin-runtime";

import { useMachineStore } from "@/stores/machine";

import BackupCreatePanel from "./BackupCreatePanel.vue";
import RestorePanel from "./RestorePanel.vue";
import CloudPanel from "./CloudPanel.vue";
import ConfigBackupHelpDialog from "./ConfigBackupHelpDialog.vue";
import { DOCS_URL, PLUGIN_MANIFEST_ID } from "../model/constants";

const machineStore = useMachineStore();

const tab = ref("create");
const helpOpen = ref(false);
/** Which destination's instructions to scroll to, when the dialog was opened from a specific
 *  destination's "Setup instructions" link rather than the generic "?" in the header. */
const helpSection = ref<string | undefined>(undefined);

function openHelpAt(section: string): void {
	helpSection.value = section;
	helpOpen.value = true;
}
const aboutOpen = ref(false);
</script>

<style scoped>
/*
 * Without a height cap, this page grows to fit whichever tab is tallest, and Vuetify's v-window
 * keeps every visited tab's content in the DOM (absolutely positioned) for its slide transition -
 * so the page's total height (and the browser's own scroll anchoring) shifts on every tab switch,
 * which reads as the page "scrolling further up" each time. `dwc-page-fill` (DWC's own convention,
 * see e.g. Settings/[[tab]].vue) caps this page to the viewport so the v-window scrolls internally
 * instead of the whole document growing.
 */
.cb-page {
	display: flex;
	flex-direction: column;
}
.cb-container {
	display: flex;
	flex-direction: column;
	flex: 1;
	min-height: 0;
}
.cb-window {
	flex: 1;
	min-height: 0;
	overflow-y: auto;
}
.cb-window :deep(.v-window__container) {
	height: 100%;
}
.cb-window :deep(.v-window-item) {
	position: static !important;
}
</style>
