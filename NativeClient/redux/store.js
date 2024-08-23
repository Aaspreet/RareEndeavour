import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  version: 1,
};

const rootReducer = combineReducers({
  [userApi.reducerPath]: userApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 128 },
      // serializableCheck: { warnAfter: 128 },
      serializableCheck: false,
    })
      .concat(userApi.middleware)
});

export const persistor = persistStore(store);
