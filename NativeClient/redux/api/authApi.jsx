import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

console.log(`${process.env.EXPO_PUBLIC_API_URL}/api/auth`);
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/api/auth` }),
  tagTypes: ["auth"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});
