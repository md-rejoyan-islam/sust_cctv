import type { IZone } from "@/lib/types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { IPagination } from "./../types";
import baseQuery from "./base-query";

export const zoneApi = createApi({
  reducerPath: "zoneApi",
  baseQuery,
  tagTypes: ["Zone"],
  endpoints: (builder) => ({
    getZones: builder.query<
      { data: IZone[]; pagination: IPagination },
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/zones",
        params,
      }),
      providesTags: ["Zone"],
    }),
    getZoneById: builder.query<IZone & { cameras: any[] }, string>({
      query: (id) => ({
        url: `/zones/${id}`,
        method: "GET",
      }),
      providesTags: ["Zone"],
      transformResponse: (response: { data: IZone & { cameras: any[] } }) =>
        response.data,
    }),
    addZone: builder.mutation<IZone, Partial<IZone>>({
      query: (data) => ({
        url: "/zones",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Zone"],
    }),
    updateZone: builder.mutation<IZone, { id: string; data: Partial<IZone> }>({
      query: ({ id, data }) => ({
        url: `/zones/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Zone"],
    }),
    deleteZone: builder.mutation<void, string>({
      query: (id) => ({
        url: `/zones/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Zone"],
    }),
  }),
});

export const {
  useGetZonesQuery,
  useGetZoneByIdQuery,
  useAddZoneMutation,
  useUpdateZoneMutation,
  useDeleteZoneMutation,
} = zoneApi;
