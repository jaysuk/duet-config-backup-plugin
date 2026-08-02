<template>
	<v-container fluid class="py-4">
		<div class="d-flex align-center mb-4">
			<v-icon size="large" class="me-3">mdi-archive-arrow-down</v-icon>
			<div class="text-title-medium">{{ $t("plugins.duetConfigBackup.configBackup.title") }}</div>
			<v-spacer />
			<v-btn icon="mdi-help-circle-outline" variant="text" :title="$t('plugins.duetConfigBackup.help.title')" @click="helpOpen = true" />
		</div>

		<v-tabs v-model="tab" class="mb-3">
			<v-tab value="create">{{ $t("plugins.duetConfigBackup.configBackup.tabs.create") }}</v-tab>
			<v-tab value="restore">{{ $t("plugins.duetConfigBackup.configBackup.tabs.restore") }}</v-tab>
			<v-tab value="cloud">{{ $t("plugins.duetConfigBackup.configBackup.tabs.cloud") }}</v-tab>
		</v-tabs>

		<v-window v-model="tab">
			<v-window-item value="create"><BackupCreatePanel :active="tab === 'create'" /></v-window-item>
			<v-window-item value="restore"><RestorePanel :active="tab === 'restore'" /></v-window-item>
			<v-window-item value="cloud"><CloudPanel /></v-window-item>
		</v-window>

		<ConfigBackupHelpDialog v-model="helpOpen" />
	</v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

import BackupCreatePanel from "./BackupCreatePanel.vue";
import RestorePanel from "./RestorePanel.vue";
import CloudPanel from "./CloudPanel.vue";
import ConfigBackupHelpDialog from "./ConfigBackupHelpDialog.vue";

const tab = ref("create");
const helpOpen = ref(false);
</script>
