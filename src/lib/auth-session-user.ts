import { authClient } from "./auth-client";

export const authSessionUser = () => {
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  return { session, isPending, error, refetch };
};
