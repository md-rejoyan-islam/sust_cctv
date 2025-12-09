import type { IPagination, IUserSchema } from "@/lib/types";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./base-query";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query<
      { data: IUserSchema[]; pagination: IPagination },
      { page?: number; limit?: number; search?: string; role?: string }
    >({
      query: (params) => ({
        url: "/users",
        params,
      }),
      providesTags: ["User"],
    }),
    getUserById: builder.query<IUserSchema, string>({
      query: (id) => `/users/${id}`,
      providesTags: ["User"],
    }),
    addUser: builder.mutation<IUserSchema, Partial<IUserSchema>>({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<
      IUserSchema,
      { id: string; data: Partial<IUserSchema> }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    userChangePassword: builder.mutation<
      void,
      { id: string; newPassword: string }
    >({
      query: (data) => ({
        url: `/users/${data.id}/change-password`,
        method: "PATCH",
        body: { newPassword: data.newPassword },
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUserChangePasswordMutation,
} = userApi;
