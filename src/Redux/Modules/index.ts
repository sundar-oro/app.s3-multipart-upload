import { combineReducers } from "@reduxjs/toolkit";
import { authSliceReducer } from "./Auth/auth.slice";
import { filesSliceReducer } from "./FileUpload";

export const combinedReducer = combineReducers({
  ...authSliceReducer,
  ...filesSliceReducer,
});
