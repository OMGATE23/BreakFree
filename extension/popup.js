import { getActiveTabURL } from "./utils.js";
let btn = document.querySelector("#btn")
const hours = document.querySelector('#hours')
const minutes = document.querySelector("#minutes")
const seconds = document.querySelector("#seconds")

let timer = await chrome.storage.sync.get('timer').timer ? await chrome.storage.sync.get('timer').timer : {
    hours: 0,
    minutes: 1,
    seconds: 0
}

await chrome.storage.sync.set({name : "OM"})

console.log("timer set " , timer)

window.addEventListener( 'beforeunload' , async (e) => {
    e.preventDefault()
    e.returnValue = timer
    await chrome.storage.sync.set({name : 'yes'})
    btn.textContent = "window unloaded!"
})

document.addEventListener('DOMContentLoaded' , async() => {
    let obj = await getActiveTabURL()

    console.log(obj.url)

    let name = await chrome.storage.sync.get('name')
    console.log(name)

    if(obj.url){
        let name = document.createElement('strong')
        name.innerHTML = `URL : ${obj.url} <div>${obj.url.includes('twitter')}</div>`;

        if(obj.url.includes('twitter') || obj.url.includes('youtube')){
            name.innerHTML = "Timer ON - twitter";
            chrome.tabs.update({url : "https://javascript.info/"})
        }

        document.body.appendChild(name)
    }
})

btn.addEventListener('click' , async() => {
    let obj = await getActiveTabURL()
    let name = await chrome.storage.sync.get('name')
    let timer = await chrome.storage.sync.get("timer")
    console.log(obj)
    console.log(name)
    console.log(timer)
})

const timerFunction = () => {
    const newSeconds = timer.seconds - 1;

    console.log({timer , isEnd : timer.hours <= 0 && timer.minutes <= 0 && timer.seconds <= 0});

    if (newSeconds < 0) {
      const newMinutes = timer.minutes - 1;
      return {
        hours: timer.hours,
        minutes: newMinutes,
        seconds: 59
      };
    }

    if (timer.minutes < 0) {
      const newHours = timer.hours - 1;
      return {
        hours: newHours,
        minutes: 59,
        seconds: 59
      };
    }

    return {
      ...timer,
      seconds: newSeconds
    };
  }

let drift, currTime, timeElapsed;
let startTime = Date.now()
const interval = setInterval(
    async () => {

    if(timer.hours <= 0 && timer.minutes <= 0 && timer.seconds <= 1){
        clearInterval(interval)
        let data = (await chrome.storage.sync.get("timer"))
        console.log(data)
    }
    currTime = timeElapsed;
    timeElapsed = Date.now() - startTime;
    drift += timeElapsed - currTime - 1000;
    timer = await timerFunction();
    hours.innerHTML = timer.hours;
    minutes.innerHTML = timer.minutes;
    seconds.innerHTML = timer.seconds
    await chrome.storage.sync.set(timer)
    console.log(await chrome.storage.sync.get("name"))
}, 500
);

chrome.tabs.onUpdated.addListener(async (tabId,tab) => {
    await chrome.storage.sync.set({timer})
})


chrome.tabs.onUpdated.addEventListener((tabId , tab) => {
    console.log('chrome tab updated from popup.js')
})