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
    </div>
  );
};

export default LoginButton;
