import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) =>{
        const session = await fetchAuthSession();
        const { idToken } = session.tokens ?? {};
        if (idToken) {
          headers.set("Authorization", `Bearer ${idToken}`);
        }
      return headers;
    }
  }),
  reducerPath: "api",
  tagTypes: [],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      queryFn: async (_arg, _queryApi, _extraoptions, fetchWithBQ) => {
        try {
          const session = await fetchAuthSession();
          const { idToken } = session.tokens ?? {};
          const user = await getCurrentUser();
          const userRole = idToken?.payload["custom:role"] as string;
          const endpoint = userRole === "manager" ? `/manager/${user.userId}` : `/tenants/${user.userId}`;

          // delegate the actual fetch to RTK Query's baseQuery wrapper
          let userDetailsResponse = await fetchWithBQ(endpoint);
          //if user doesnt exist in our database, create new user
          return userDetailsResponse;
        } catch (error) {
          console.error(error);
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: String(error),
            },
          } as any;
        }
      },
    }),
  }),
});

export const {} = api;
