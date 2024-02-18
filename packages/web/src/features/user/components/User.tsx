import { User } from "@core/entities/User";
import { useState } from "react";

interface UserProps {
  isUserLoading: boolean;
  user: User | null | undefined;
  resetUser: () => void;
}

export default function User({ isUserLoading, user, resetUser }: UserProps) {
  const [isAuthorizePageLoading, setIsAuthorizePageLoading] = useState(false);

  const signOut = async () => {
    localStorage.removeItem("session");

    resetUser();
  };

  const signIn = () => {
    setIsAuthorizePageLoading(true);
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/auth/google/authorize`;
  };

  return (
    <>
      {isUserLoading || isAuthorizePageLoading ? (
        <p className="text-white">Loading...</p>
      ) : user ? (
        <div>
          <img
            className="h-10 w-10 rounded-full"
            src={user.picture}
            alt="profile picture"
          />
          <p className="text-white">Hello, {user.name}</p>
          <button
            className="bg-red-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
          onClick={() => signIn()}
        >
          Sign In
        </button>
      )}
    </>
  );
}
