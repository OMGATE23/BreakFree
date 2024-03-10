const iframeEl = document.createElement("iframe");
iframeEl.src = "http://localhost:5173/breakfreeiframe";
document.body.appendChild(iframeEl);
let timerInformation = null;
let timerInterval;

function handleVisibilityChange() {
  if (document.hidden) {
    // If the page is hidden, clear the timer interval
    clearInterval(timerInterval);
  } else {
    // If the page becomes visible again, start the timer interval
    timerInterval = setInterval(updateCountdown, 1000);
  }
}
window.addEventListener("message", (e) => {
  const data = e.data;

  switch (data.type) {
    case "INIT": {
      // get uid
      chrome.storage.local.get("user_id", function (result) {
        const user_id = result.user_id;
        e.source?.postMessage(
          { type: "REQ_TIMER", uid: user_id, domain: window.location.hostname },
          "*"
        );
      });

      break;
    }
    case "RES_TIMER": {
      if (data.timer) {
        initiateTimer(data.timer);
        document.addEventListener("visibilitychange", () => {
          if (!document.hidden) {
            initiateTimer(data.timer);
          }
        });
      }

      break;
    }
    default: {
      break;
    }
  }
});

function initiateTimer(timer) {
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.bottom = "10px";
  modal.style.right = "10px";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  modal.style.color = "#fff";
  modal.style.padding = "10px";
  modal.style.borderRadius = "5px";
  modal.style.zIndex = "9999";
  document.body.appendChild(modal);

  let localCountdown = localStorage.getItem("countdown");
  let lastTimeTimerStarted = localStorage.getItem("last_time");

  let countdown = timer.hours * 3600 + timer.minutes * 60 + timer.seconds;

  if (Number(lastTimeTimerStarted) + 24 * 60 * 60 * 1000 >= Date.now()) {
    countdown = localCountdown ? Number(localCountdown) : countdown;
  } else {
    localStorage.setItem("last_time", Date.now());
  }

  if (window.location.href.includes("https://get-break-free.vercel.app/")) {
    let checker = setInterval(() => {
      if (localStorage.getItem("user_id")) {
        chrome.storage.local.set(
          { user_id: localStorage.getItem("user_id") },
          function () {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
              clearInterval(checker);
            }
          }
        );
        clearInterval(checker);
      }
    }, 1000);
  }

  updateCountdown();
  function updateCountdown() {
    if (countdown > 0) {
      const hours = Math.floor(countdown / 3600);
      const minutes = Math.floor((countdown % 3600) / 60);
      const seconds = countdown % 60;
      modal.textContent = `${formatTime(hours)}:${formatTime(
        minutes
      )}:${formatTime(seconds)}`;
      if (!document.hidden) {
        countdown--;
        localStorage.setItem("countdown", countdown);
        timerInterval = setTimeout(updateCountdown, 1000);
      } else {
        clearInterval(timerInterval);
      }
    } else {
      modal.textContent = "Times up!";
      modal.style.width = "100vw";
      modal.style.height = "100vh";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.display = "flex";
      modal.style.alignItems = "center";
      modal.style.justifyContent = "center";
    }
  }
}

function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}
