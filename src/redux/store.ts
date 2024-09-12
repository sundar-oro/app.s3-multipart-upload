import { configureStore } from '@reduxjs/toolkit';
import {persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Ensure this import is correct
import userReducer from './userSlice';
import persistStore from "./persistateStore"
const persistConfig = {
  key: 'root',
  storage: persistStore 

};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store:any = configureStore({
  reducer: persistedReducer,
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
