import { readFile } from "@/features/chat/helper/readFile";
import type { Files } from "@/features/user/types/file.type";
import type { StoreState } from "@/redux/store";
import Markdown from "@/shared/components/Markdown";
import { useCallback, useEffect, useState } from "react";
import { IoReload } from "react-icons/io5";
import { useSelector } from "react-redux";

const Preview = () => {
  const files = useSelector((store: StoreState) => store.chatFile.files);
  const [content, setContent] = useState<string>("");
  const [activeFile, setActiveFile] = useState<Files | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadFile = useCallback(async () => {
    if (!activeFile?.filePath) return;
    const text = await readFile(activeFile.filePath);
    setContent(text ?? "");
  }, [activeFile]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFile();
  }, [loadFile]);

  const handleRefresh = useCallback(async () => {
    await loadFile();
    setRefreshKey((key) => key + 1);
  }, [loadFile]);

  if (!files) return null;

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-hidden p-2 bg-transparent border border-border">
      <div className="flex justify-between items-center">
        <div className="flex shrink-0 flex-wrap gap-2 mx-10 ">
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
        <button
          type="button"
          onClick={handleRefresh}
          title="Refresh preview"
          className="text-muted-foreground transition-colors hover:text-foreground active:animate-spin"
        >
          <IoReload />
        </button>
      </div>{" "}
      {content.includes("html") ? (
        <iframe
          key={refreshKey}
          title="File preview"
          srcDoc={content}
          className="min-h-0 w-full flex-1 rounded-md border border-border bg-white"
        />
      ) : (
        <Markdown content={content} />
      )}
    </div>
  );
};

export default Preview;
