import useLogin from "../../hooks/useLogin";

const LoginButton = () => {
  const { login } = useLogin();
  return (
    <div className="flex gap-4">
      <button
        className="text-xl py-2 px-4 rounded-md bg-emerald-500 outline outline-1 text-white cursor-pointer"
        onClick={login}
      >
        Login
      </button>
      <button
        className="text-xl p-2 px-4 rounded-md bg-white outline outline-1 text-emerald-700 cursor-pointer"
        onClick={login}
      >
        Sign Up
      </button>
    </div>
  );
};

export default LoginButton;
