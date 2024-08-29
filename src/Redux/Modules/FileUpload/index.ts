import { filesSliceReducer } from "./files.slice";

const combinedReducer = {
  ...filesSliceReducer,
};

export * from "./files.slice";
export default combinedReducer;
