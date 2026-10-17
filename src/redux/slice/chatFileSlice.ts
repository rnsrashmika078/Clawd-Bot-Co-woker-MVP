import { ChatFileType } from "@/features/user/types/file.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  files: ChatFileType[];
};

const initState: InitialState = {
  files: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    setChatFiles: (state, action: PayloadAction<ChatFileType>) => {
      console.log("COMING UP", action.payload);
      const exist = action.payload.files.some((newFile) =>
        state.files.some((f) =>
          f.files.some(
            (existingFile) => existingFile.fileName === newFile.fileName,
          ),
        ),
      );
      if (!exist) {
        state.files.push(action.payload);
      }
    },
  },
});

export const { setChatFiles } = authSlice.actions;

export default authSlice.reducer;
