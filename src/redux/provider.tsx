"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { store } from "./store";

export function Providers({ children }: { children: React.ReactNode }) {
  let persistor: any;

  if (store) {
    persistor = persistStore(store, {}, function () {
      persistor.persist();
    });
  }
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} />
      {children}
    </Provider>
  );
}
