import { readFile } from "@/features/chat/helper/readFile";
import type { Files } from "@/features/user/types/file.type";
import type { StoreState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Preview = () => {
	const files = useSelector((store: StoreState) => store.chatFile.files);
	const [content, setContent] = useState<string | null>(null);
	const [activeFile, setActiveFile] = useState<Files | null>(null);

	useEffect(() => {
		const func = async () => {
			if (activeFile?.filePath) {
				const text = await readFile(activeFile.filePath);

				if (text) setContent(text);
			}
		};
		func();
	}, [activeFile]);

	if (!files) return null;

	return (
		<div className="flex h-full w-full flex-col gap-2 overflow-hidden p-2">
			<div className="flex shrink-0 flex-wrap gap-2">
				{files.flatMap((fP, idxP) =>
					fP.files.map((f) => {
						const isActive = activeFile?.filePath === f.filePath;
						return (
							<button
								type="button"
								key={`${idxP}-${f.filePath}`}
								onClick={() =>
									setActiveFile({
										fileName: f.fileName,
										filePath: f.filePath,
									})
								}
								className={`rounded-md border border-border px-2 py-1 text-xs transition-colors hover:bg-accent ${
									isActive ? "bg-accent" : "bg-card"
								}`}
							>
								{f.fileName}
							</button>
						);
					}),
				)}
			</div>

			<iframe
				title="File preview"
				srcDoc={content ?? ""}
				className="min-h-0 w-full flex-1 rounded-md border border-border bg-white"
			/>
		</div>
	);
};

export default Preview;
