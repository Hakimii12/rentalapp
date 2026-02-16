import { useAuthenticator } from "@aws-amplify/ui-react";
import { useGetAuthUserQuery } from "@/state/api";

export function AuthBootstrap() {
  const { user } = useAuthenticator((ctx) => [ctx.user]);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetAuthUserQuery(undefined, {
    skip: !user, // 🛑 critical
  });

  if (!user) return null;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Auth error</div>;

  return null;
}
