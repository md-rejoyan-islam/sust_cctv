import { createApi } from "@reduxjs/toolkit/query/react";
import { IUserSchema } from "../types";
import baseQuery from "./base-query";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<
      {
        data: {
          user: IUserSchema;
          access_token: string;
          refresh_token: string;
        };
      },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    refreshToken: builder.mutation<
      { access_token: string; refresh_token: string },
      void
    >({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    getProfile: builder.query<IUserSchema, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      transformResponse: (response: { data: IUserSchema }) => response.data,
    }),
    updateProfile: builder.mutation<any, Partial<any>>({
      query: (data) => ({
        url: "/auth/me",
        method: "PUT",
        body: data,
      }),
    }),
    changePassword: builder.mutation<
      void,
      { currentPassword: string; newPassword: string }
    >({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
