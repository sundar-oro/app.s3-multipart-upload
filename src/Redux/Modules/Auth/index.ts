import { authSliceReducer } from "./auth.slice";

const combinedReducer = {
    ...authSliceReducer,

};

export * from "./auth.slice";
export default combinedReducer;
