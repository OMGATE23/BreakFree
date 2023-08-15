import { useAuth0 } from "@auth0/auth0-react";

export const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
     (
      <button
        className="text-[1rem] p-1 px-6 rounded-md bg-green-600 outline outline-1 text-white cursor-pointer"
        onClick={() =>
          {
            localStorage.removeItem('token')
            logout({ logoutParams: { returnTo: window.location.origin } })
          }

        }
      >
        Logout
      </button>
    )
  );
};
