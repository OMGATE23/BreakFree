import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import useFirestore from "../../hooks/useFirestore";
export type TimerResponse = {
  response: string | null;
  errorOccured: boolean;
};

export type TimerData = {
  url: string;
  hours: number;
  seconds: number;
  minutes: number;
};
function CreateTimerForm({
  timers,
  setTimers,
}: {
  timers: any;
  setTimers: Dispatch<SetStateAction<any>>;
}) {
  const [url, setUrl] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [response, setResponse] = useState<TimerResponse>({
    response: null,
    errorOccured: false,
  });

  let { addTimer, getAllTimers } = useFirestore();
  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
    if (value === "other") {
      setUrl("");
    } else {
      setUrl(value);
    }
  };
  const handleCustomUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUrl(event.target.value);
  };
  function submitHandler(e: FormEvent) {
    e.preventDefault();
    if (hours === 0 && minutes === 0 && seconds === 0) {
      setResponse({
        response: "Set Timer of Minimum 5 minuts",
        errorOccured: true,
      });
      setMinutes(5);
      setHours(0);
      setSeconds(0);
      return;
    }

    if (!url) {
      setResponse({
        response: "Url is necessary for creating timer",
        errorOccured: true,
      });
      return;
    }

    if (checkTimerExists(url)) {
      setResponse({
        response: "Timer already exists",
        errorOccured: true,
      });
      return;
    }
    let timer: TimerData = { url, hours, minutes, seconds };
    addTimer(timer, setResponse, setTimers);
  }

  function checkTimerExists(url: string) {
    if (Array.isArray(timers)) {
      return timers.filter((timer: TimerData) => timer.url === url).length > 0;
    }
    return true;
  }
  useEffect(() => {
    getAllTimers(setTimers);
  }, []);
  return (
    <div className="outline outline-1 rounded-md p-8 bg-green-100">
      <h1 className="text-2xl text-green-900 mb-4 text-center font-semibold">
        Create Timers!
      </h1>
      <form className="flex flex-col gap-4" onSubmit={submitHandler}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <label>URL:</label>
            <select
              className="bg-green-50 outline outline-1 w-full px-2 py-1 rounded-md"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              <option value="">Select URL</option>
              <option value="instagram.com">instagram.com</option>
              <option value="linkedin.com">linkedin.com</option>
              <option value="facebook.com">facebook.com</option>
              <option value="twitter.com">twitter.com</option>
              <option value="youtube.com">youtube.com</option>
              <option value="other">Other</option>
            </select>
          </div>
          {selectedOption === "other" && (
            <div className="">
              <label className="flex items-center justify-between gap-4">
                Enter URL:
                <input
                  className="px-2 py-1 bg-green-50 w-[90%] rounded-md"
                  type="text"
                  value={url}
                  onChange={handleCustomUrlChange}
                  placeholder="Enter custom URL"
                />
              </label>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-4">
          <label>Hours:</label>
          <input
            className="px-2 py-1 bg-green-50 w-[50%] rounded-md"
            type="number"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <label>Minutes:</label>
          <input
            className="px-2 py-1 bg-green-50 w-[50%] rounded-md"
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <label>Seconds:</label>
          <input
            className="px-2 py-1 bg-green-50 w-[50%] rounded-md"
            type="number"
            value={seconds}
            onChange={(e) => setSeconds(Number(e.target.value))}
          />
        </div>
        <button type="submit">Submit Form</button>
      </form>
      <p
        className={`my-4 text-center ${
          response.errorOccured ? "text-red-700" : "text-green-700"
        }`}
      >
        {response.response}
      </p>
    </div>
  );
}

export default CreateTimerForm;
