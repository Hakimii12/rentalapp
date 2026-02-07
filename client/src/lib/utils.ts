import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const createNewUserInDatabase = async (user: any,userRole:string,idToken:any,fetchWithBQ: any) => {
  const createEndpoint =userRole?.toLowerCase()==="manager" ? "/manager" : "/tenant";
  console.log("userRole",userRole)
  const createUserResponse = await fetchWithBQ({
    url:createEndpoint,
    method: "POST",
    body:{
      cognitoId: user.userId,
      name:user.username,
      email:idToken?.payload?.email||"",
      phoneNumber: ""
    }
   });
  if(createUserResponse.error){
     throw new Error("failed to create user in record")
    }

    return createUserResponse;
  }
  