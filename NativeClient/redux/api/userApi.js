import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/api/test` }),
  tagTypes: ["user"],
  endpoints: (builder) => ({
    testQ: builder.query({
      query: () => "/",
      // providesTags: ["user"],
    }),
    testM: builder.mutation({
      query: () => ({
        url: "/",
        method: "POST",
      }),
      // invalidatesTags: ["user"],
    }),
  }),
});

export const { useTestQQuery, useTestMMutation, useLazyTestQQuery } = userApi;
