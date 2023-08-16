// @ts-nocheck

import { gql, useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import UpdateTimer from "../UpdateTimer";
import { API_URL } from "../../constants";
//import trashIcon from "./trash.svg";

const GET_TIMERS_QUERY = `
  query TimerSearch($sub : String!) @live {
    timerSearch(filter: {sub : {eq : $sub}} , first: 50 ){
      edges {
        node {
          sub
          url
          id
          timer {
            hours
            minutes
            seconds
          }
        }
      }
    }
  }
  `;

const AP_GET_TIMERS_QUERY = gql`
  query TimerSearch($sub: String!) @live {
    timerSearch(filter: { sub: { eq: $sub } }, first: 50) {
      edges {
        node {
          sub
          url
          id
          timer {
            hours
            minutes
            seconds
          }
        }
      }
    }
  }
`;

const DELETE_TIMER = `
    mutation TimerDelete($id : ID!) {
        timerDelete(by: {id : $id}){
            deletedId
        }
    }
`;

const DisplayTimers = ({ token, refresh }) => {
  const { user } = useAuth0();
  const [timerData, setTimerData] = useState<Array<any>>([]);
  const [deletedId, setDeletedId] = useState("");
  const [showTooltip, setShowToolTip] = useState({
    show: false,
    x: 0,
    y: 0,
    message: "",
  });
  const [showUpdateModal , setShowUpdateModal] = useState({show :false , timer: {} , token})
  
  useEffect(() => {
    getUserTimers();
  }, [refresh]);

  async function deleteTimer(id: String) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: DELETE_TIMER,
          variables: {
            id: id,
          },
        }),
      });

      const dataRecieved = await res.json();
      getUserTimers();
      console.log(dataRecieved);
    } catch (err) {
      console.log(err);
    }
  }

  async function getUserTimers() {
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: GET_TIMERS_QUERY,
            variables: {
              sub: user?.sub,
            },
          }),
        });
        //console.log("this failed!!")

        const dataRecieved = await res.json();

        setTimerData(dataRecieved?.data?.timerSearch?.edges);
        if (dataRecieved.errors[0]) {
          return (
            <>
              <p>Seems like there was an error {":("}</p>
              <p>{dataRecieved.errors[0]}</p>
            </>
          );
        }
      } catch (err) {
        return <p>{JSON.stringify(err)}</p>;
      }
    }

  useEffect(() => {
    getUserTimers();
  }, []);

  function getTimeString(num : Number){
    if(num < 10 ){
      return "0" + num
    }
    return num;
  }
  return (
    <div className="">
      {timerData?.length > 0 ? (
        <div className="grid py-4 grid-cols-2 xl:grid-cols-3 justify-center gap-4">
          {timerData.map(({ node }) => {
            return (
              <div
                className="outline  outline-1 w-full px-4 py-2 flex flex-col md:flex-row items-center justify-between md:gap-6 bg-emerald-200 rounded-md"
                key={node?.id}
              >
                <div>
                  <p>url : {node?.url}</p>
                  <p>
                    timer :{" "}
                    {`${getTimeString(node.timer.hours)} : ${getTimeString(node.timer.minutes)} : ${getTimeString(node.timer.seconds)}`}
                  </p>
                </div>
                <div className="flex flex-row md:flex-col gap-2">
                  <div
                    className=" p-2 delete"
                    
                    onClick={() => {
                      setDeletedId(node.id);
                      deleteTimer(node.id);
                    }}
                  >
                    <TrashIcon className="h-6  cursor-pointer" />
                  </div>
                  <div className="p-2 update"

                    onClick={() => {
                        setShowUpdateModal({show : true , timer : node , token})
                    }}
                  ><PencilIcon className="h-6 cursor-pointer" /></div>
                  
                </div>
              </div>
            );
          })}

        </div>
      ) : (
        <div className="m-auto w-[40vh] text-2xl .">
          Create New Timers!
        </div>
      )}
      <UpdateTimer setShowUpdateModal = {setShowUpdateModal} modalData = {showUpdateModal}/>
    </div>
  );
};

export default DisplayTimers;
