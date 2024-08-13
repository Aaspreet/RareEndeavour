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
    getPost: builder.query({
      query: (postId) => `fetch_single/${postId}`,
    }),
    getPosts: builder.mutation({
      query: (info) => ({ url: `fetch_multiple`, method: "POST", body: { ...info } }),
    }),
    createPost: builder.mutation({
      query: (post) => ({
        url: `create`,
        method: "POST",
        body: { ...post },
      }),
    }),
    editPost: builder.mutation({
      query: (post) => ({
        url: `edit`,
        method: "POST",
        body: { ...post },
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
  useGetPostQuery,
  useLazyGetPostQuery,
  useGetPostsMutation,
  useCreatePostMutation,
  useEditPostMutation,
  useDeletePostMutation,
} = postsApi;
