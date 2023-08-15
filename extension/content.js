(async function () {
  
  const storageCache = {};
  
  const START_TIME = Date.now()
  const date = new Date(Date.now())
  let data = []
  const getTimers = `
  query TimerSearch($sub : String!) {
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
          lastStarted
        }
      }
    }
  }
  `;
  let userToken
  window.addEventListener('blur', async () => {
    let duration = Date.now() - START_TIME
    localStorage.setItem('duration' , duration)
    localStorage.setItem('startTime' , START_TIME)
    await chrome.storage.sync.get(["token", "sub"]).then(async (result) => {
      TOKEN = result.token;
      userToken = result.token;
      await setHistory(result.sub , result.token)
    })
  })
  let modal = document.createElement("div");
  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  modal.append(modalContent);
  const modalStyleEl = document.createElement("style");
  modalStyleEl.innerText = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
    .THIS_IS_SOCIAL_DETOX_APP_MODAL {
      background-color : #16a34a!important;
      color : white!important;
      position : fixed!important;
      z-index : 2147483647!important;
      font-family: 'Poppins', sans-serif!important;
      font-size : 48px!important;
      display : flex!important;
      justify-content : center!important;
      align-items : center!important;
    }
    .close-modal {
      position : absolute!important;
      background : none!important; border : none!important; top : 5px!important; right : 5px!important; color : #94a3b8!important; 
      font-size : 0.75rem !important; cursor : pointer!important;
    }

    .modal-content {
      height : 100%!important;
    }
  `;
  modal.appendChild(modalStyleEl);
  modal.className = "THIS_IS_SOCIAL_DETOX_APP_MODAL";

  let closeModal = document.createElement("button");
  closeModal.className = "close-modal";
  closeModal.textContent = " X ";

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
  modal.appendChild(closeModal);

  let hostEl = document.createElement('div')
  hostEl.className = "SOCIAL_MEDIA_DETOX_SHADOW_ROOT"
  document.body.appendChild(hostEl)
  let hostModal = document.querySelector('.SOCIAL_MEDIA_DETOX_SHADOW_ROOT')
  let root = hostModal.attachShadow({mode : 'open'})
  root.appendChild(modal)

  let currentUrl = window.location.href;
  
  let TOKEN = "";

  if (currentUrl.includes("http://localhost:5173/")) {
    let tokenInterval = setInterval(() => {
      TOKEN = localStorage.getItem("token");
      let sub = localStorage.getItem("sub");
      if (TOKEN) {
        chrome.storage.sync.set({ token: JSON.parse(TOKEN), sub }).then(() => {
          console.log("Value is set");
        });
        clearInterval(tokenInterval);
      }
    }, 1000);
  } else {
    await chrome.storage.sync.get(["token", "sub"]).then(async (result) => {
      TOKEN = result.token;
      userToken = result.token
      await getUserTimers(result.sub, result.token);
    });

  }

  let isSocialMediaSite = checkForSocialMediaApp(
    extractMainNameFromURL(currentUrl + "")
  );
  if (isSocialMediaSite !== false) {
    if (!document.body.querySelector(".THIS_IS_SOCIAL_DETOX_APP_MODAL")) {
      document.body.prepend(modal);
    }
    localStorage.setItem("url", extractMainNameFromURL(currentUrl));
    //modal.innerText = "Social Media App Detected";

    await chrome.storage.sync.get(["token", "sub"]).then(async (result) => {
      TOKEN = result.token;
      await getUserTimers(result.sub, result.token);
    });
    console.log(data[isSocialMediaSite].node)
    if((!data[isSocialMediaSite].node.lastStarted || data[isSocialMediaSite].node.lastStarted < (Date.now() - (24*60*60*1000))) || localStorage.getItem("timer") != 'undefined'){
      lastCreatedUpdate(data[isSocialMediaSite].node.id , userToken)
      console.log(data[isSocialMediaSite].node.lastStarted , (Date.now() - (24*60*60*1000)))
      runTimer();
      window.onfocus = () => {
      runTimer();
    } 
    
    } else {
      modalStyleEl.innerText =
      modalStyleEl.innerText +
      `
      .THIS_IS_SOCIAL_DETOX_APP_MODAL {
        display : block!important;
        width : 100vw!important; height : 100vh!important;
        top : 0!important; right: 0!important;
        border-radius : 0!important;
      }

      `;
      const imgElement = document.createElement("img");
      imgElement.src = chrome.runtime.getURL("plant.png");
      closeModal.style.display = "none!important"
      
      modalContent.innerHTML = `
        <div>Times up!</div>
        <a href = "http://localhost:5173/" class = 'breakfree-link' >Go To BreakFree</a>
      `;
      modalContent.prepend(imgElement)
      const styleEl = document.createElement("style")
      styleEl.innerText = `
        .modal-content {
          display : flex!important;
          width : 100vw!important;
          height : 100vh!important;
          flex-direction : column!important;
          justify-content : center!important;
          align-items : center!important;
          font-size : 3rem!important;
          gap : 1rem!important;
        }

        img {
          width : 200px!important;
        }

        .breakfree-link {
          background : white!important;
          padding : 0.75rem 1rem!important;
          color : green!important;
          border-radius : 1rem!important;
          font-size : 1.25rem!important;
          text-decoration : none!important;
        }
      `
      modalContent.appendChild(styleEl)
    }
    
  } else {
    modalContent.innerText = "have a good day!";
    modalContent.style.display = "none";
  }

  function checkForSocialMediaApp(url) {
    for (let i = 0; i < data.length; i++) {
      if (url.includes(data[i].node.url)) {
        return i;
      }
    }
    return false;
  }

  function extractMainNameFromURL(url) {
    let mainName = url.replace(/^(https?:\/\/)?(www\.)?/, "");
    mainName = mainName.replace(/\/.*$/, "");

    return mainName;
  }

  try {
    chrome.runtime.onMessage.addListener((message) => {
      console.log(message);
    });
  } catch (err) { }

  const timerFunction = (timer) => {
    const newSeconds = timer.seconds - 1;

    if (newSeconds < 0) {
      const newMinutes = timer.minutes - 1;
      return {
        hours: timer.hours,
        minutes: newMinutes,
        seconds: 59,
      };
    }

    if (timer.minutes < 0) {
      const newHours = timer.hours - 1;
      return {
        hours: newHours,
        minutes: 59,
        seconds: 59,
      };
    }

    return {
      ...timer,
      seconds: newSeconds,
    };
  };

  function runTimer() {
    let drift, currTime, timeElapsed;
    let startTime = Date.now();

    let timer = data[isSocialMediaSite].node.timer;
    let localTimer = ((localStorage.getItem("timer") != 'undefined' || !localStorage.getItem('timer'))) ? JSON.parse(localStorage.getItem("timer")) : timer;

    if(localStorage.getItem("timer") == 'undefined' && data[isSocialMediaSite].node.lastStarted > (Date.now() - (24*60*60*1000))){
      modalStyleEl.innerText =
      modalStyleEl.innerText +
      `
      .THIS_IS_SOCIAL_DETOX_APP_MODAL {
        display : block!important;
        width : 100vw!important; height : 100vh!important;
        top : 0!important; right: 0!important;
        border-radius : 0!important;
      }

      `;
      const imgElement = document.createElement("img");
      imgElement.src = chrome.runtime.getURL("plant.png");
      closeModal.style.display = "none!important"
      
      modalContent.innerHTML = `
        <div>Times up!</div>
        <a href = "http://localhost:5173/" class = 'breakfree-link' >Go To BreakFree</a>
      `;
      modalContent.prepend(imgElement)
      const styleEl = document.createElement("style")
      styleEl.innerText = `
        .modal-content {
          display : flex!important;
          width : 100vw!important;
          height : 100vh!important;
          flex-direction : column!important;
          justify-content : center!important;
          align-items : center!important;
          font-size : 3rem!important;
          gap : 1rem!important;
        }

        img {
          width : 200px!important;
        }

        .breakfree-link {
          background : white!important;
          padding : 0.75rem 1rem!important;
          color : green!important;
          border-radius : 1rem!important;
          font-size : 1.25rem!important;
          text-decoration : none!important;
        }
      `
      modalContent.appendChild(styleEl)

      return;
    }
    if (
      localTimer &&
      timer.hours >= localTimer.hours &&
      timer.minutes >= localTimer.minutes
    ) {
      timer = localTimer;
    }

    modalStyleEl.innerText =
      modalStyleEl.innerText +
      `
          .THIS_IS_SOCIAL_DETOX_APP_MODAL {
            padding : 1rem 2rem;
      top : 1rem;
      right : calc(0% + 1rem);
      width : fit-content;
      min-width : 200px;
      height : fit-content;
      border-radius: 1rem;
          }
      `;

    function getFormattedTimeVal(val) {
      if(val < 10) {
        return "0" + val;
      }
      return val;
    }
    const interval = setInterval(async () => {
      localStorage.setItem("timer", JSON.stringify(timer));

      window.onblur = () => {
        clearInterval(interval);
      };
      currTime = timeElapsed;
      timeElapsed = Date.now() - startTime;
      drift += timeElapsed - currTime - 1000;
      timer = timerFunction(timer);
      //console.log(timer)
      modalContent.innerText = `${getFormattedTimeVal(timer.hours)} : ${getFormattedTimeVal(timer.minutes)} : ${getFormattedTimeVal(timer.seconds)}`;
      if (timer.hours <= 0 && timer.minutes <= 0 && timer.seconds <= 0) {
        clearInterval(interval);
        localStorage.setItem(
          "timer",
          JSON.stringify(data[isSocialMediaSite].timer)
        );

        modalStyleEl.innerText =
          modalStyleEl.innerText +
          `
          .THIS_IS_SOCIAL_DETOX_APP_MODAL {
            display : block!important;
            width : 100vw!important; height : 100vh!important;
            top : 0!important; right: 0!important;
            border-radius : 0!important;
          }

          `;
          const imgElement = document.createElement("img");
          imgElement.src = chrome.runtime.getURL("plant.png");
          closeModal.style.display = "none!important"
          
          modalContent.innerHTML = `
            <div>Times up!</div>
            <a href = "http://localhost:5173/" class = 'breakfree-link' >Go To BreakFree</a>
          `;
          modalContent.prepend(imgElement)
          const styleEl = document.createElement("style")
          styleEl.innerText = `
            .modal-content {
              display : flex!important;
              width : 100vw!important;
              height : 100vh!important;
              flex-direction : column!important;
              justify-content : center!important;
              align-items : center!important;
              font-size : 3rem!important;
              gap : 1rem!important;
            }

            img {
              width : 200px!important;
            }

            .breakfree-link {
              background : white!important;
              padding : 0.5rem 1rem!important;
              color : green!important;
              border-radius : 1rem!important;
              font-size : 1.25rem!important;
              text-decoration : none!important;
            }
          `
          modalContent.appendChild(styleEl)
      }
    }, 1000);
  }

  async function getUserTimers(sub, token) {
    const res = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: getTimers,
        variables: {
          sub: sub,
        },
      }),
    });
    //console.log("this failed!!")

    const dataRecieved = await res.json();
    data = (dataRecieved?.data?.timerSearch?.edges)
    chrome.storage.sync.set({ timerData: data });
  }

  async function setHistory(sub , token){
    const CREATE_HISTORY = `mutation HistoryCreate($HistoryCreateInput : HistoryCreateInput!) {
      historyCreate(input: $HistoryCreateInput){
        history {
          startTime
          duration
          url
          sub
        }
      }
    }`
    let url = new URL(window.location.href)

    const res = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: CREATE_HISTORY,
        variables: {
          HistoryCreateInput : {
            url : url.hostname,
            startTime : START_TIME,
            duration : Date.now() - START_TIME,
            sub : sub,
            date :`${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
          }
        },
      }),
    });

    let dataR = await res.json()
    console.log(dataR)
  }

  async function lastCreatedUpdate(id , token){
    QUERY = `mutation TimerUpdate($id : ID , $lastStarted : Int) {
      timerUpdate(by: {id : $id} , input: {lastStarted : {set : $lastStarted}}){
        timer {
          url
          sub
          lastStarted
        }
      }
    }
    `
    console.log(id)
    const res = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: QUERY,
        variables: {
          id : id,
          lastStarted : Date.now()

        },
      }),
    });
    let dataR = await res.json()
    console.log(dataR)
  }
})();
