"use client"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { cleanParams, createNewUserInDatabase } from "@/lib/utils";
import { Application, Lease, Manager, Payment, Property, Tenant } from "@/types/prismaTypes";
import { FiltersState } from ".";
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
  tagTypes: ["Managers","Tenants","Properties","PropertyDetails","Applications","Payments","Leases"],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      queryFn: async (_arg, _queryApi, _extraoptions, fetchWithBQ) => {
        try {
          const session = await fetchAuthSession();
          const { idToken } = session.tokens ?? {};
          const user = await getCurrentUser();
          const userRole = idToken?.payload["custom:role"] as string;
          const endpoint = userRole === "manager" ? `/manager/${user.userId}` : `/tenant/${user.userId}`;
          // delegate the actual fetch to RTK Query's baseQuery wrapper
          let userDetailsResponse = await fetchWithBQ(endpoint);

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
  // property related endpoint
  getProperties:build.query<Property[],Partial<FiltersState> & {favoriteIds?:number[]}>({
      query: (filters) => {
        const params = cleanParams({
          location: filters.location,
          priceMin: filters.priceRange?.[0],
          priceMax: filters.priceRange?.[1],
          beds: filters.beds,
          baths: filters.baths,
          propertyType: filters.propertyType,
          squareFeetMin: filters.squareFeet?.[0],
          squareFeetMax: filters.squareFeet?.[1],
          amenities: filters.amenities?.join(","),
          availableFrom: filters.availableFrom,
          favoriteIds: filters.favoriteIds?.join(","),
          latitude: filters.coordinates?.[1],
          longitude: filters.coordinates?.[0],
        });

        return { url: "properties", params };
      },
      providesTags:(result)=>result?[...result.map(({id})=>({type:"Properties" as const,id})),
                                     {type:"Properties",id:"LIST"}
      ]:
      [{ type: "Properties", id: "LIST" }],
  }),
  createApplication: build.mutation<Application, Partial<Application>>({
      query: (body) => ({
        url: `applications`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Applications"],}),
  GetProperty:build.query<Property,number>({
       query: (id) => `properties/${id}`,
       providesTags: (result, error, id) => [{ type: "PropertyDetails", id }],
  }),
    // tenant related 
    addFavoriteProperty:build.mutation<Tenant,{ cognitoId: string; propertyId: number }>({
      query:({cognitoId, propertyId })=>({
        url: `tenant/${cognitoId}/favorites/${propertyId}`,
        method: "POST",
      }),
      invalidatesTags: (result) => [
        { type: "Tenants", id: result?.id },
        { type: "Properties", id: "LIST" },
      ],
    }),
    removeFavoriteProperty: build.mutation<
      Tenant,
      { cognitoId: string; propertyId: number }
    >({
      query: ({ cognitoId, propertyId }) => ({
        url: `tenant/${cognitoId}/favorites/${propertyId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result) => [
        { type: "Tenants", id: result?.id },
        { type: "Properties", id: "LIST" },
      ],
    }),
    getTenant:build.query<Tenant,string>({
      query:(cognitoId)=>`tenant/${cognitoId}`,
      providesTags:(result) => [{ type: "Tenants", id: result?.id }],
    }),
    getCurrentResidences: build.query<Property[], string>({
      query: (cognitoId) => `tenant/${cognitoId}/current-residences`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Properties" as const, id })),
              { type: "Properties", id: "LIST" },
            ]
          : [{ type: "Properties", id: "LIST" }],
          }), 
              // lease related enpoints
       getLeases: build.query<Lease[], number>({
      query: () => "leases",
      providesTags: ["Leases"],
      async onQueryStarted(_, { queryFulfilled }) {
      },
    }),

    getPropertyLeases: build.query<Lease[], number>({
      query: (propertyId) => `properties/${propertyId}/leases`,
      providesTags: ["Leases"],
    }),

    getPayments: build.query<Payment[], number>({
      query: (leaseId) => `leases/${leaseId}/payments`,
      providesTags: ["Payments"],
      async onQueryStarted(_, { queryFulfilled }) {
      },
    }),
    
})});

export const { useGetAuthUserQuery,
   useUpdateTenantSettingsMutation,
   useUpdateManagerSettingsMutation,
  useGetPropertiesQuery,
  useAddFavoritePropertyMutation,
   useRemoveFavoritePropertyMutation,
  useGetTenantQuery,
  useGetPropertyQuery,
  useCreateApplicationMutation,
  useGetCurrentResidencesQuery,
  useGetLeasesQuery,
  useGetPaymentsQuery,
  useGetPropertyLeasesQuery} = api;
