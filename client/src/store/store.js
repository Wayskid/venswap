import appReducer, { initialState } from "./features/appSlice.js";
import { appApi } from "../services/appApi.js";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import { setupListeners } from "@reduxjs/toolkit/query";
import localforage from "localforage";
import sessionStorage from "redux-persist/lib/storage/session";
import createMigrate from "redux-persist/lib/createMigrate";

const newVersion = 5;

const migration = {
  [newVersion]: (state) => {
    return {
      ...state,
      reducerOne: initialState,
    };
  },
};

const persistConfig = {
  key: "root",
  version: 1,
  storage: localforage,
  migrate: createMigrate(migration, { debug: false }),
};

const userPersistConfig = {
  key: "user",
  storage: sessionStorage,
};

const reducer = combineReducers({
  app: persistReducer(userPersistConfig, appReducer),
  [appApi.reducerPath]: appApi.reducer,
});

const persistorReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistorReducer,
  devTools: import.meta.env.VITE_NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat([appApi.middleware]),
});

setupListeners(store.dispatch);
