import { createSlice } from "@reduxjs/toolkit";
import { Files } from "./files";

const reducerName = "files";

export const initialState: Files.FileUploadData = {
  filesList: [],
};

export const filesSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    storeFilesArray: (state: any, action: any) => {
      let temp = [...state.filesList, ...action.payload];
      state.filesList = temp;
    },
    removeOneElement: (state: any, action: any) => {
      const selectedFilesCopy = [...state.filesList];
      selectedFilesCopy.splice(action.payload, 1);
      state.filesList = selectedFilesCopy;
    },
    setToInitialState: (state: any) => {
      state = initialState;
    },
  },
});

export const { storeFilesArray, removeOneElement, setToInitialState }: any =
  filesSlice.actions;
export const filesSliceReducer = { [reducerName]: filesSlice.reducer };
