/**
 * Host wiring for the automatic backup nudges: turns dwc-config-backup-core's pure predicates into
 * actual DWC toasts. Installed once at plugin load, torn down on `dwcPluginUnloaded`.
 *
 * These are reminders, never silent uploads or downloads. Clicking one just opens this plugin's page,
 * same as opening it from the nav menu yourself.
 */
import { watch } from "vue";

import {
	CONFIG_SAVE_COOLDOWN_MS, buildMachineIdentity, computeMachineKey, getAutoBackupNudgeSettings,
	getBackedUpMachineKeys, getLastBackupAt, isBackupOverdue, isUnseenMachine,
} from "dwc-config-backup-core";

import Events from "@/utils/events";
import { LogLevel, useUiStore } from "@/stores/ui";
import { useMachineStore } from "@/stores/machine";
import i18n from "@/i18n";

import { ROUTE_PATH } from "./constants";

type FileUploadedHandler = (e: { filename: string }) => void;

let fileUploadedHandler: FileUploadedHandler | null = null;
let stopConnectWatch: (() => void) | null = null;
let lastConfigSaveNudgeAt = 0;
let checkedThisSession = false;

export function installAutoBackupNudges(): void {
	const uiStore = useUiStore();
	const machineStore = useMachineStore();

	fileUploadedHandler = (e) => {
		const settings = getAutoBackupNudgeSettings();
		if (!settings.configSaved) { return; }
		if (!e.filename.toLowerCase().endsWith("/config.g")) { return; }
		const now = Date.now();
		if (now - lastConfigSaveNudgeAt < CONFIG_SAVE_COOLDOWN_MS) { return; }
		lastConfigSaveNudgeAt = now;
		uiStore.log(
			LogLevel.info,
			i18n.global.t("plugins.duetConfigBackup.configBackup.nudge.configSavedTitle"),
			i18n.global.t("plugins.duetConfigBackup.configBackup.nudge.configSavedBody"),
			ROUTE_PATH,
		);
	};
	// Cast: DWC's Events emitter is strictly typed against its own ~30 known event shapes; this
	// plugin only ever subscribes to one of them, never invents a new event type.
	Events.on("fileUploaded", fileUploadedHandler as never);

	function checkOnConnect(): void {
		if (!machineStore.isConnected || checkedThisSession) { return; }
		checkedThisSession = true;
		const settings = getAutoBackupNudgeSettings();
		const identity = buildMachineIdentity(machineStore.model as unknown);
		const machineKey = computeMachineKey(identity);
		const knownKeys = new Set(getBackedUpMachineKeys());

		if (settings.newMachine && isUnseenMachine(machineKey, knownKeys)) {
			uiStore.log(
				LogLevel.info,
				i18n.global.t("plugins.duetConfigBackup.configBackup.nudge.newMachineTitle"),
				i18n.global.t("plugins.duetConfigBackup.configBackup.nudge.newMachineBody"),
				ROUTE_PATH,
			);
			return; // one nudge per connect is enough - don't also fire "overdue" straight after
		}
		if (settings.overdue && isBackupOverdue(getLastBackupAt(), settings.overdueDays)) {
			uiStore.log(
				LogLevel.info,
				i18n.global.t("plugins.duetConfigBackup.configBackup.nudge.overdueTitle"),
				i18n.global.t("plugins.duetConfigBackup.configBackup.nudge.overdueBody", { days: settings.overdueDays }),
				ROUTE_PATH,
			);
		}
	}
	stopConnectWatch = watch(() => machineStore.isConnected, (connected) => { if (connected) { checkOnConnect(); } }, { immediate: true });
}

export function uninstallAutoBackupNudges(): void {
	if (fileUploadedHandler) { Events.off("fileUploaded", fileUploadedHandler as never); fileUploadedHandler = null; }
	if (stopConnectWatch) { stopConnectWatch(); stopConnectWatch = null; }
	checkedThisSession = false;
	lastConfigSaveNudgeAt = 0;
}
