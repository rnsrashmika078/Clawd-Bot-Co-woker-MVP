export type ChatFileType = {
  threadId: string;
  files: Files[];
};
export type Files = {
  filePath: string;
  fileName: string;
};
