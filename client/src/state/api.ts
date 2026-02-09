import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { createNewUserInDatabase } from "@/lib/utils";
import { Manager, Tenant } from "@/types/prismaTypes";
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
  tagTypes: ["Managers","Tenants",],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      queryFn: async (_arg, _queryApi, _extraoptions, fetchWithBQ) => {
        try {
          const session = await fetchAuthSession();
          const { idToken } = session.tokens ?? {};
          const user = await getCurrentUser();
          const userRole = idToken?.payload["custom:role"] as string;
          const endpoint = userRole === "manager" ? `/manager/${user.userId}` : `/tenant/${user.userId}`;
          console.log(endpoint)
          // delegate the actual fetch to RTK Query's baseQuery wrapper
          let userDetailsResponse = await fetchWithBQ(endpoint);
 
          console.log("userDetailsResponse", userDetailsResponse)
            // if user not found in our database, create new user
            if (userDetailsResponse.error &&  userDetailsResponse.error.status === 404 ) {
              userDetailsResponse = await createNewUserInDatabase(
                user,
                userRole, 
                idToken,
                fetchWithBQ
              );
            }
          //if user doesnt exist in our database, create new user
          return {
            data:{
              cognitoInfo:{...user},
              userRole,
              userInfo: userDetailsResponse.data as Tenant | Manager
            }
          }
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
    updateTenantSettings:build.mutation<Tenant , {cognitoId:string} & Partial<Tenant>>({
      query:({cognitoId,...updatedTenant})=>({
        url: `tenant/${cognitoId}`,
        method: "PUT",
        body: updatedTenant,
      }),
      invalidatesTags:(result)=>[{type:"Tenants",id:result?.id}],
    }),
    updateManagerSettings: build.mutation<Manager,{ cognitoId: string } & Partial<Manager>>({
      query: ({ cognitoId, ...updatedManager }) => ({
        url: `manager/${cognitoId}`,
        method: "PUT",
        body: updatedManager,
      }),
      invalidatesTags: (result) => [{ type: "Managers", id: result?.id }],
  }),
})});

export const { useGetAuthUserQuery, useUpdateTenantSettingsMutation,useUpdateManagerSettingsMutation} = api;
