/**
 * The DWC-backed `MachineIO` implementation for this plugin, binding dwc-config-backup-core's
 * abstract machine interface to DWC 3.7's Pinia machine store.
 *
 * Every call is fully silent (no progress toast, no success/error notification) - backup and restore
 * drive hundreds of these and report their own aggregated progress via the panels themselves.
 */
import type { FileListEntry, MachineIO } from "dwc-config-backup-core";

import { useMachineStore } from "@/stores/machine";

export function defaultMachineIO(): MachineIO {
	const machineStore = useMachineStore();
	return {
		async getFileList(directory) {
			return machineStore.getFileList(directory) as unknown as Promise<Array<FileListEntry>>;
		},
		async downloadText(filename) {
			return (await machineStore.download({ filename, type: "text" }, false, false, false, false)) as string;
		},
		async downloadBlob(filename) {
			return (await machineStore.download({ filename, type: "blob" }, false, false, false, false)) as Blob;
		},
		async upload(filename, content) {
			await machineStore.upload({ filename, content }, false, false, false, false);
		},
		async deleteFile(filename, recursive) {
			await machineStore.delete(filename, recursive);
		},
		async sendCode(code) {
			return machineStore.sendCode(code, false, false);
		},
	};
}
