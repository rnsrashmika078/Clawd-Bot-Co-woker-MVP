import { readFile } from "node:fs/promises";
import { ipcMain } from "electron";

export function fileHandler() {
	ipcMain.handle("read-file", async (_event, filePath: string) => {
		return readFile(filePath, "utf-8");
	});
}
