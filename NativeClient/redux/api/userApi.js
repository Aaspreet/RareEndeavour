import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "../../config/firebaseConfig";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/api/user`,
    prepareHeaders: async (headers) => {
      const token = await auth.currentUser.getIdToken(true);
      headers.set("Authorization", `Bearer ${token}`);
      // headers.set("Cache-Control", "no-cache");
    },
  }),
  tagTypes: ["user"],
  endpoints: (builder) => ({
    fetchUsername: builder.query({
      query: () => `get_username`,
      providesTags: ["user"],

    }),
    getProfilePicture: builder.query({
      query: () => `get_profile_picture`,
      providesTags: ["user"],
    }),
    getTimestamp: builder.query({
      query: () => `get_date_created`,
      providesTags: ["user"],
    }),
    updateProfilePicture: builder.mutation({
      query: ({profilePicture}) => ({
        url: `update_profile_picture`,
        method: "POST",
        body: { profilePicture },
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useFetchUsernameQuery,
  useLazyFetchUsernameQuery,
  useGetProfilePictureQuery,
  useGetTimestampQuery,
  useUpdateProfilePictureMutation,
} = userApi;
