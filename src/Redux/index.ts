import { persistStore, persistReducer } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import pesistStorage from "./persistateStore";
import { combinedReducer } from "./Modules";

export const makeStore = ({ isServer }: any) => {
  if (typeof isServer === undefined || isServer) {
    isServer = typeof window === "undefined";
  }
  if (isServer) {
    return configureStore({
      reducer: combinedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    });
  } else {
    const persistConfig = {
      key: "multi-part",
      version: 1,
      storage: pesistStorage,
      REHYDRATE: false,
    };
    const persistedReducer = persistReducer(persistConfig, combinedReducer);
    const store: any = configureStore({
      reducer: persistedReducer,
    });

    store.__persistor = persistStore(store);

    return store;
  }
};
