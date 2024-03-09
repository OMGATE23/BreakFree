import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import { Dispatch, SetStateAction } from "react";
import { TimerData, TimerResponse } from "../components/CreateTimerForm";
export default function useFirestore() {
  const { state } = useAuthContext();
  const { user } = state;
  async function addTimer(
    data: TimerData,
    setResponse: Dispatch<SetStateAction<TimerResponse>>,
    setTimers: Dispatch<SetStateAction<any>>
  ) {
    try {
      if (!user) {
        return setResponse({ response: "No user found", errorOccured: true });
      }
      await addDoc(collection(db, "timers"), {
        ...data,
        user_id: user.uid,
      });
      await getAllTimers(setTimers);
      return setResponse({
        response: "Timer created!",
        errorOccured: false,
      });
    } catch (error: any) {
      return setResponse({ response: error.message, errorOccured: true });
    }
  }

  async function getAllTimers(setTimers: Dispatch<SetStateAction<any>>) {
    try {
      if (!user) {
        return;
      }
      const q = query(
        collection(db, "timers"),
        where("user_id", "==", user.uid)
      );
      const docSnap = await getDocs(q);
      let timers: any[] = [];
      docSnap.forEach((doc) => {
        timers.push({
          id: doc.id,
          url: doc.data().url,
          hours: doc.data().hours,
          minutes: doc.data().minutes,
          seconds: doc.data().seconds,
        });
      });
      setTimers(timers);
    } catch (err) {
      console.log(err);
      setTimers({ err, errorOccured: true });
    }
  }

  async function deleteTimer(
    id: string,
    setTimers: Dispatch<SetStateAction<any>>
  ) {
    try {
      if (!user) {
        return;
      }
      await deleteDoc(doc(db, "timers", id));
      await getAllTimers(setTimers);
    } catch (error: any) {
      console.log(error);
    }
  }

  return {
    addTimer,
    getAllTimers,
    deleteTimer,
  };
}
