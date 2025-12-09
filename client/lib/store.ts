import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "./api/auth";
import { cameraApi } from "./api/cameras";
import { userApi } from "./api/users";
import { zoneApi } from "./api/zones";

export const store = configureStore({
  reducer: {
    [cameraApi.reducerPath]: cameraApi.reducer,
    [zoneApi.reducerPath]: zoneApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      cameraApi.middleware,
      zoneApi.middleware,
      userApi.middleware,
      authApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
