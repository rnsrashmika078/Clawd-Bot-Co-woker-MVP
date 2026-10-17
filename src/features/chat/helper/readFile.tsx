export const readFile = async (
	filePath: string,
): Promise<string | undefined> => {
	try {
		const text = await window.ipcRenderer.invoke("read-file", filePath);

		if (!text) {
			throw new Error("Empty file");
		}

		return text as string;
	} catch (error) {
		console.error("Error reading file:", error);
	}
};
