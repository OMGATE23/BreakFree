import useLogout from "../../hooks/useLogout";
export const LogoutButton = () => {
  const { logout } = useLogout();
  return (
    <button
      className="text-[1rem] p-1 px-6 rounded-md bg-green-600 outline outline-1 text-white cursor-pointer"
      onClick={() => {
        localStorage.removeItem("token");
        logout();
      }}
    >
      Logout
    </button>
  );
};
