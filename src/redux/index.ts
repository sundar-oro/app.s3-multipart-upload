import { configureStore } from '@reduxjs/toolkit';
import {PERSIST, persistReducer, REHYDRATE } from 'redux-persist';

import userReducer from './Modules/userlogin/userlogin.slice';

import pesistStorage from "./persistateStore";
const persistConfig = {
  key: 'file manager',
  version: 1,
  storage: pesistStorage,
  REHYDRATE: false, 

};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store:any = configureStore({
  reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [ REHYDRATE,  PERSIST],
      },
    }),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
