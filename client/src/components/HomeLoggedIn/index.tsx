import CreateTimerForm from "../CreateTimerForm";
import { useAuthContext } from "../../hooks/useAuthContext";
import DisplayTimers from "../DisplayTimers";
import { useState } from "react";

const HomeLoggedIn = () => {
  let { state } = useAuthContext();
  let { user } = state;
  //const [createTimer , {createTimerData , createTimerError , createTimerLoading}] = useMutation(createTimerGqlQuery)
  const [timers, setTimers] = useState();
  if (user) {
    localStorage.setItem("sub", user.uid);
  }

  return (
    <div className="flex flex-col items-center gap-8 w-[100vw] min-h-[80dvh] justify-center">
      {user && (
        <div className="flex w-[80%] gap-8 flex-col md:flex-row mx-auto justify-center ">
          <CreateTimerForm timers={timers} setTimers={setTimers} />
          <DisplayTimers timers={timers} setTimers={setTimers} />
        </div>
      )}
    </div>
  );
};

export default HomeLoggedIn;
