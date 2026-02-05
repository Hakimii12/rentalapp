import React from 'react';
import { Amplify } from 'aws-amplify';

import { Authenticator, Heading, Radio, RadioGroupField, useAuthenticator, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { usePathname, useRouter } from 'next/dist/client/components/navigation';

Amplify.configure({
    Auth:{
        Cognito:{
            userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
            userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
        }
    }
});
const components = {
  Header(){
    return(
      <View className='mt-4 mb-7'>
        <Heading level={3} className='!text-2xl !font-bold'>
          RENT
          <span className="text-red-400 font-light hover:!text-gray-300">
            IFUL
          </span>
          <p className="text-muted-foreground mt-2">
            <span className="font-bold">
              Welcome!
            </span>
            Please sign in to continue
          </p>
        </Heading>
      </View>
    )
  },
  SignIn:{
    Footer(){
      const {toSignUp} = useAuthenticator();
        return(
              <View className='mt-4 text-center'>
               <p className="text-muted-foreground">Don't have an account? {"  "}<button onClick={toSignUp} 
               className="text-gray hover:underline bg-transparent border-none cursor-pointer p-0 ml-1">
                Sign Up Here
               </button></p>
              </View>
            )
    }
    
  },
  
  SignUp:{
   FormFields(){
       const {validationErrors}=useAuthenticator();
   return(
    <>
    <Authenticator.SignUp.FormFields/>
    <RadioGroupField  
    legend="Role"
    name="custom:role"
    errorMessage={validationErrors?.["custom:role"]}
    hasError={!!validationErrors?.["custom:role"]} 
    isRequired>
      <Radio value="tenant">Tenant</Radio>
      <Radio value="manager">Manager</Radio>
</RadioGroupField>
    </>
   )
   } 
,
    Footer(){
      const {toSignIn} = useAuthenticator();
        return(
              <View className='mt-4 text-center'>
               <p className="text-muted-foreground">Aleady have an account? {"  "}<button onClick={toSignIn} 
               className="text-gray hover:underline bg-transparent border-none cursor-pointer p-0 ml-1">
                Sign In
               </button></p>
              </View>
            )
    }

  }
  
}
const formFields ={
  signUp:{
    username:{
      placeholder:"choose your username",
      label:"Username",
      isRequired:true
    },
    email:{
      order:2,
      placeholder:"Enter Your Email",
      label:"Email",
      isRequired:true
    },
    password:{
      order:3,
      placeholder:"Create a password",
      label:"Password",
      isRequired:true
    },
    confirm_password:{
      order:4,
      placeholder:"Confirm a password",
      label:"Confirm Password",
      isRequired:true
    }
  }
}
const Auth = ({children}: {children: React.ReactNode})=> {
  const {user} = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage =pathname.match(/^\/(signin|signup)$/);
  const isDashboard = pathname.startsWith('/manager') || pathname.startsWith('/tenant');
  React.useEffect(()=>{
    if(user && isAuthPage){
      router.push('/');
    }
  }, [user, isAuthPage, router]);
 if(!isAuthPage && !isDashboard){
  return <>{children}</>;
 }
  return (
    <div className="h-full">
     <Authenticator 
     initialState ={pathname.includes('signup') ? "signUp" : "signIn"}
     components={components} formFields={formFields}>{children}</Authenticator>
    </div>
  );
}
export default Auth;