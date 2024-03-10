(() => {
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

  if (window.location.href.includes("https://get-break-free.vercel.app/")) {
    let checker = setInterval(() => {
      console.log("checking....");
      if (localStorage.getItem("sub")) {
        chrome.storage.local.set({ sub: sub }, function () {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          } else {
            console.log('Successfully stored "sub" property in Chrome Storage');
          }
        });
        clearInterval(checker);
      }
    });
  } else {
    chrome.storage.local.get("sub", function (result) {
      const sub = result.sub;
      // Log the 'sub' property to the console
      console.log("sub:", sub);
    });

    updateCountdown();
  }
  let localCountdown = localStorage.getItem("countdown");
  let lastTimeTimerStarted = localStorage.getItem("last_time");

  let countdown = 10;

  if (Number(lastTimeTimerStarted) + 24 * 60 * 60 * 1000 >= Date.now()) {
    countdown = localCountdown ? Number(localCountdown) : countdown;
  } else {
    localStorage.setItem("last_time", Date.now());
  }

  function updateCountdown() {
    if (countdown > 0) {
      const hours = Math.floor(countdown / 3600);
      const minutes = Math.floor((countdown % 3600) / 60);
      const seconds = countdown % 60;
      modal.textContent = `${formatTime(hours)}:${formatTime(
        minutes
      )}:${formatTime(seconds)}`;
      countdown--;
      localStorage.setItem("countdown", countdown);
      setTimeout(updateCountdown, 1000);
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

  function formatTime(time) {
    return time < 10 ? `0${time}` : time;
  }
})();
