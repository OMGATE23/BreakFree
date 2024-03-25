import { Dispatch, SetStateAction, useEffect } from "react";
import useFirestore from "../../hooks/useFirestore";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useAuthContext } from "../../hooks/useAuthContext";
export default function DisplayTimers({
  timers,
  setTimers,
}: {
  timers: any;
  setTimers: Dispatch<SetStateAction<any>>;
}) {
  let { getAllTimers, deleteTimer } = useFirestore();
  let { state } = useAuthContext();
  let { user } = state;
  useEffect(() => {
    if (user) getAllTimers(user.uid, setTimers);
  }, []);

  function deleteTimerHandler(id: string) {
    deleteTimer(id, setTimers);
  }

  function padNumber(number: number) {
    return String(number).padStart(2, "0");
  }
  return (
    <div className="font-[300]" id="timers">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {timers &&
          Array.isArray(timers) &&
          timers.map((timer) => (
            <div
              className="outline outline-1 p-4 rounded-md bg-green-50"
              id={timer.id}
              key={timer.id}
            >
              <div className="flex items-center gap-2 justify-between">
                <p>{timer.url}</p>
                <button
                  onClick={() => {
                    deleteTimerHandler(timer.id);
                  }}
                >
                  <TrashIcon className="h-6 cursor-pointer" />
                </button>
              </div>

              <p>
                {padNumber(timer.hours)} : {padNumber(timer.minutes)} :{" "}
                {padNumber(timer.seconds)}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
