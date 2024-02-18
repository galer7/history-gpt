import { useMutation } from "@tanstack/react-query";

import { User } from "@core/entities/User";
import { ExtractFnReturnType } from "@web/lib/react-query";

export const getUser = async (token: string | null) => {
  if (!token) {
    return null;
  }

  const user = await fetch(`${import.meta.env.VITE_API_URL}/session`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response;
      }

      throw new Error("Something went wrong");
    })
    .then((res) => res.json())
    .then((res) => res as User);

  return user;
};

type MutationFnType = typeof getUser;

type UseUserOptions = {
  token: Parameters<MutationFnType>[0];
};

export const useUserV2 = ({ token }: UseUserOptions) => {
  return useMutation<ExtractFnReturnType<MutationFnType>>({
    mutationFn: async () => {
      console.log("token", token);
      const user = await getUser(token);

      console.log("user", user);

      return user;
    },
  });
};

export const signOut = async () => {
  localStorage.removeItem("session");
};
