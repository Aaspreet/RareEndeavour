import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "../../config/firebaseConfig.js";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/api/auth`,
    prepareHeaders: async (headers) => {
      const token = await auth.currentUser.getIdToken();
      headers.set("Authorization", `Bearer ${token}`);
      // headers.set("Cache-Control", "no-cache"); 
    },
  }),

  tagTypes: ["auth"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: ({ username, token }) => {
        return {
          url: "/register",
          method: "POST",
          body: { username },
        };
      },
      onQueryStarted: async (arg, { queryFulfilled }) => {
        console.log("Query started");
        try {
          const { data } = await queryFulfilled;
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useRegisterMutation } = authApi;
