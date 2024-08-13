import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";
import { postsApi } from "./api/postsApi";
import { commentsApi } from "./api/commentsApi";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  version: 1,
};

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [postsApi.reducerPath]: postsApi.reducer,
  [commentsApi.reducerPath]: commentsApi.reducer,
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
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(postsApi.middleware)
      .concat(commentsApi.middleware),
});

export const persistor = persistStore(store);
