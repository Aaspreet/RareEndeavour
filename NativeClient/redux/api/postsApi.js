import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "../../config/firebaseConfig.js";

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/api/posts`,
    prepareHeaders: async (headers) => {
      const token = await auth.currentUser.getIdToken(true);
      headers.set("Authorization", `Bearer ${token}`);
      // headers.set("Cache-Control", "no-cache");
    },
  }),
  endpoints: (builder) => ({
    fetchPost: builder.query({
      query: (postId) => `get-single/${postId}`,
    }),
    fetchPosts: builder.mutation({
      query: (params) => ({ url: `fetch-multiple`, method: "POST", body: { ...params } }),
    }),
    createPost: builder.mutation({
      query: (params) => ({
        url: `create`,
        method: "POST",
        body: { ...params },
      }),
    }),
    editPost: builder.mutation({
      query: (params) => ({
        url: `edit`,
        method: "POST",
        body: { ...params },
      }),
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `delete/${postId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchPostQuery,
  useLazyFetchPostQuery,
  useFetchPostsMutation,
  useCreatePostMutation,
} = postsApi;
