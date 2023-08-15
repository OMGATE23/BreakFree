// @ts-nocheck
import { useAuth0 } from "@auth0/auth0-react";
import React, { useState } from "react";
import getAllTimers from '../../utils/getAllTimers.js'

const createTimerGqlQuery = `
  mutation TimerCreate($TimerCreateInput : TimerCreateInput!) {
  timerCreate(input: $TimerCreateInput){
    timer {
      sub
      id
      url
      timer {
        hours
        minutes
        seconds
      }
    }
  }
}
`;

const CreateTimerForm = ({ token }) => {
  const [response, setResponse] = useState({positive : true , message : ""});
  const { user } = useAuth0();
  const [selectOption, setSelectOption] = useState("");
  const [showOtherUrl, setShowOtherUrl] = useState(false);

  function checkDuplicateTimer(timer){
    let isDup = false
    if(timer?.length > 0){
      timer.map(({node}) => {
        if(node.url == selectOption){
          isDup = true
        } else {
          isDup = false
        }
      });
    }

    return isDup
  }

  async function setTimerFormHandler(e) {
    e.preventDefault();
    let timers = await getAllTimers(token , user?.sub)
    console.log(timers)
    console.log(selectOption)
    console.log(checkDuplicateTimer(timers))
    let formData = new FormData(e.target);

    if(checkDuplicateTimer(timers)){
      setResponse({
        positive : false,
        message : "Timer for the url is already set"
      });
      return
    }


    let TimerCreateInput = {
      url: selectOption,
      sub: user?.sub,
      timer: {
        hours: Number(formData.get("hours")),
        minutes: Number(formData.get("minutes")),
        seconds: Number(formData.get("seconds")),
      },
    };

    console.log(TimerCreateInput);
    if (TimerCreateInput.url === "") {
      setResponse({
        positive : false,
        message : "Please enter valid URL"
      });
      return;
    }

    if (
      TimerCreateInput.timer.hours === 0 &&
      TimerCreateInput.timer.minutes === 0 &&
      TimerCreateInput.timer.seconds === 0
    ) {
      setResponse({
        positive : false,
        message : "Please enter timer time"
      });
      return;
    }
    const res = await fetch("https://breakfree-omgate23.grafbase.app/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: createTimerGqlQuery,
        variables: {
          TimerCreateInput: {
            url: selectOption,
            sub: user?.sub,
            timer: {
              hours: Number(formData.get("hours")),
              minutes: Number(formData.get("minutes")),
              seconds: Number(formData.get("seconds")),
            },
          },
        },
      }),
    });
    //console.log("this failed!!")

    const data = await res.json();
    if (data.data) {
      setResponse({
        positive : true,
        message : "Timer Created Succesfully"
      });
    }
    if (data.errors) {
      setResponse({
        positive : false,
        message : data.errors[0].message
      });
    }
  }
  const websiteOptions = [
    "instagram.com",
    "linkedin.com",
    "facebook.com",
    "twitter.com",
    "youtube.com",
    "twitch.tv",
    "threads.com",
  ];
  return (
    <div className="shadow-lg min-h-[60vh] flex flex-col md:w-fit md:mx-auto rounded-md pt-2 pb-4 outline outline-3 outline-green-700 px-8 justify-center bg-green-50">
        <h2 className="text-center text-2xl mt-2 font-medium text-green-700 ">Create Timer</h2>
      <form
        className="flex flex-col items-center gap-8 justify-between max-h-full rounded-xl md:w-fit mx-auto px-8 py-6 pb-4"
        onSubmit={setTimerFormHandler}
      >
        <label className="flex flex-col md:flex-row justify-between md:w-full items-center gap-1 md:gap-4" htmlFor="url">
          <p>Select a Website:</p>
          <select
            className=" w-full md:w-[80%] rounded-md bg-green-300 py-1 px-4"
            id="url"
            name="url"
            onChange={(e) => {
              if (e.target.value !== "other") {
                setSelectOption(e.target.value);
                setShowOtherUrl(false);
              } else {
                setShowOtherUrl(true);
              }
            }}
          >
            <option value="">Select option</option>
            {websiteOptions.map((option) => (
              <option className="py-1 px-4 bg-gray-200" key={option} value={option}>
                {option}
              </option>
            ))}
            <option>other</option>
          </select>
        </label>
        {showOtherUrl && (
          <label className="w-full flex md:flex-row flex-col gap-2 justify-center items-center">
            Enter other URL:
            <input
                className="md;w-full text-center py-1 px-4 rounded-md outline focus:outline-blue-700 focus:outline-2"
              type="text"
              onChange={(e) => setSelectOption(e.target.value)}
            />
          </label>
        )}

        <div className="grid grid-cols-3 justify-center gap-8">
          <label className="flex items-center flex-col gap-4">
            hours:
            <input className="block py-1 px-2 rounded-md focus:outline-2 outline focus:outline-blue-600" name="hours" type="number" max="1" min="0" />
          </label>
          <label className="flex items-center flex-col gap-4">
            mins:
            <input className="block py-1 px-2 rounded-md focus:outline-2 outline focus:outline-blue-600" name="minutes" type="number" max="59" min="0" />
          </label>
          <label className="flex items-center flex-col gap-4">
            sec:
            <input className="block py-1 px-1 rounded-md focus:outline-2 outline focus:outline-blue-600" name="seconds" type="number" max="59" min="0" />
          </label>
        </div>
        <button className="outline w-fit outline-1 rounded-md bg-green-700 font-semibold text-white py-2 px-6">Set Timer</button>
      </form>
      {response.message && <div className={`${response.positive ? ' bg-green-600 ' : ' bg-red-600 '} rounded-md w-[80%] py-2 px-2 mx-auto text-center`}>{response.message}</div>}
    </div>
  );
};

export default CreateTimerForm;
