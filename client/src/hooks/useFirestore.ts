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
      await getAllTimers(user.uid, setTimers);
      return setResponse({
        response: "Timer created!",
        errorOccured: false,
      });
    } catch (error: any) {
      return setResponse({ response: error.message, errorOccured: true });
    }
  }

  async function getAllTimers(
    uid: string,
    setTimers: Dispatch<SetStateAction<any>>
  ) {
    try {
      const q = query(collection(db, "timers"), where("user_id", "==", uid));
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
      return timers;
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
      await getAllTimers(user.uid, setTimers);
    } catch (error: any) {
      console.log(error);
    }
  }
  async function addHistory(data: {
    user_id: string;
    domain: string;
    time: number;
  }) {
    try {
      if (!data.user_id) {
        return;
      }
      await addDoc(collection(db, "timers"), {
        ...data,
        createdAt: new Date(Date.now()),
      });
    } catch (error: any) {
      console.log(error);
    }
  }
  return {
    addTimer,
    getAllTimers,
    deleteTimer,
    addHistory,
  };
}
