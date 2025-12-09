import type { ICameraSchema, IPagination } from "@/lib/types";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./base-query";

export const cameraApi = createApi({
  reducerPath: "cameraApi",
  baseQuery,
  tagTypes: ["Camera"],
  endpoints: (builder) => ({
    getCameras: builder.query<
      { data: ICameraSchema[]; pagination: IPagination },
      {
        page?: number;
        limit?: number;
        zone?: string;
        status?: string;
        search?: string;
        includeZone?: boolean;
      }
    >({
      query: (params) => ({
        url: "/cameras",
        params,
      }),
      providesTags: ["Camera"],
    }),
    getCameraById: builder.query<ICameraSchema, string>({
      query: (id) => `/cameras/${id}`,
      providesTags: ["Camera"],
      transformResponse: (response: { data: ICameraSchema }) => response.data,
    }),
    getCameraHistory: builder.query<any[], string>({
      query: (cameraId) => `/cameras/${cameraId}/history`,
    }),
    addCamera: builder.mutation<ICameraSchema, Partial<ICameraSchema>>({
      query: (data) => ({
        url: "/cameras",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Camera"],
    }),
    updateCamera: builder.mutation<
      ICameraSchema,
      { id: string; data: Partial<ICameraSchema> }
    >({
      query: ({ id, data }) => ({
        url: `/cameras/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Camera"],
    }),
    deleteCamera: builder.mutation<void, string>({
      query: (id) => ({
        url: `/cameras/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Camera"],
    }),
    camaraStat: builder.query<
      {
        data: {
          overview: {
            totalCameras: number;
            activeCameras: number;
            inactiveCameras: number;
            statusPercentages: {
              active: number;
              inactive: number;
            };
          };
          zoneDistribution: {
            _id: string;
            zoneName: string;
            cameraCount: number;
          }[];
        };
      },
      void
    >({
      query: () => "/cameras/stats",
    }),
  }),
});

export const {
  useGetCamerasQuery,
  useGetCameraByIdQuery,
  useGetCameraHistoryQuery,
  useAddCameraMutation,
  useUpdateCameraMutation,
  useDeleteCameraMutation,
  useCamaraStatQuery,
} = cameraApi;
