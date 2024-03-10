import { useEffect, useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { auth, provider } from "../firebase/config";
import { User, signInWithPopup } from "firebase/auth";

export default function useLogin() {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async () => {
    setIsPending(true);
    setError(null);

    try {
      const res = await signInWithPopup(auth, provider);

      dispatch({ type: "LOGIN", payload: res.user });
      let { user }: { user: User } = res;
      localStorage.setItem("user_id", user.uid);
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err: any) {
      console.log(err);
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { login, isPending, error };
}
