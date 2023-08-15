import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const {loginWithRedirect , user } = useAuth0();
  //auth0|64d2135e7f18450dc24e6cbd
  //auth0|64d2135e7f18450dc24e6cbd
  //google-oauth2|111515898458218600429

  async function login () {
    await loginWithRedirect()
    console.log(user)
    //console.log(process.env.JWT_SECRET)
  }
  return (
     (<div className="flex gap-4">
      <button
        className="text-xl py-2 px-4 rounded-md bg-emerald-500 outline outline-1 text-white cursor-pointer"
        onClick={ () => 
            login()
        }
      >
        Login
      </button>
      <button
        className="text-xl p-2 px-4 rounded-md bg-white outline outline-1 text-emerald-700 cursor-pointer"
        onClick={ () => 
            login()
        }
      >
        Sign Up
      </button>
      </div>
    )
  );
};

export default LoginButton;
