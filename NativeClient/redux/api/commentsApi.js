import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "../../config/firebaseConfig.js";

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/api/comments`,
    prepareHeaders: async (headers) => {
      const token = await auth.currentUser.getIdToken(true);
      headers.set("Authorization", `Bearer ${token}`);
      // headers.set("Cache-Control", "no-cache");
    },
  }),
  endpoints: (builder) => ({
    getComments: builder.mutation({
      query: (params) => ({ url: `fetch`, method: "POST", body: { ...params } }),
    }),
    createComment: builder.mutation({
      query: (comment) => ({
        url: `create`,
        method: "POST",
        body: { ...comment },
      }),
    }),
  }),
});

export const { useCreateCommentMutation, useGetCommentsMutation } = commentsApi;
