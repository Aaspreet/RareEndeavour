import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "../../config/firebaseConfig";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/api/user`,
    prepareHeaders: async (headers) => {
      // console.log(auth.currentUser);
      const token = await auth.currentUser?.getIdToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      // console.log(token)
      // headers.set("Cache-Control", "no-cache");
    },
  }),
  tagTypes: ["user"],
  endpoints: (builder) => ({
    fetchUser: builder.query({
      query: () => `/`,
      providesTags: ["user"],
    }),
    fetchTargetUser: builder.query({
      query: (params) => `/${params.uid}`,
    }),
    updateQuote: builder.mutation({
      query: (params) => ({
        url: `/update-quote`,
        method: "POST",
        body: { ...params },
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const { useFetchUserQuery, useLazyFetchUserQuery } = userApi;
