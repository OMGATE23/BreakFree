import { useEffect } from "react";
import useFirestore from "../../hooks/useFirestore";

const BreakFreeIframe = () => {
  const { getAllTimers } = useFirestore();

  useEffect(() => {
    window.addEventListener("message", async (e) => {
      const data = e.data;
      const domain = data.domain;

      switch (data.type) {
        case "REQ_TIMER": {
          const uid = data.uid;
          const timers = await getAllTimers(uid, () => {});
          const timer = timers?.filter((timer) => {
            return domain.includes(timer.url);
          })[0];
          window.parent.postMessage(
            {
              type: "RES_TIMER",
              domain,
              timer,
            },
            "*"
          );
          break;
        }

        case "CREATE_HISTORY": {
          console.log("Create a History");
          break;
        }
        default: {
          break;
        }
      }
    });

    window.parent.postMessage({ type: "INIT" }, "*");
  }, []);

  return <div>BreakFreeIframe</div>;
};

export default BreakFreeIframe;
