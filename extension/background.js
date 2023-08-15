//chrome.tabs.create({url : "http://localhost:5173/"})
chrome.runtime.onInstalled.addListener(({reason}) => {
    if (reason === 'install') {
        chrome.tabs.create({url : "http://localhost:5173/"})
    }
  });


chrome.tabs.onUpdated.addListener(async (tabId , tab) => {

    console.log({tab , tabId})
    console.log('tab update!')
    
    if(tab){
        console.log('tried sending message' , tab)
        chrome.tabs.sendMessage(tabId,{
            type : "NEW",
            videoId : tab
        })
    }
    console.log('message should be sent')
    
    if(tab.url){
        console.log(tab.url)

        
        console.log('message sent')
    }
    let obj = await getActiveTabURL()

    console.log('history')
    chrome.history.search({text: '', maxResults: 10}, function(data) {
        console.log( JSON.stringify(data))
    });

    chrome.history.getVisits({url : 'https://www.instagram.com/'} , (data) => {
        console.log(data)
    })
    
    // if(obj.url){
    //     chrome.tabs.sendMessage(tabId,{
    //         type : "NEW",
    //         videoId : obj.url
    //     })
    // }

    if(obj.url && obj.url.includes('youtube')){
        chrome.tabs.update({url : "https://javascript.info/"})
    }
})

async function getActiveTabURL(){
    let queryOptions = {active : true , currentWindow : true};
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log('getActiveTabURL func() =>' , tab.url)
    return tab;
}

console.log("hi")
  
//   sender.tab.id, () => {
//     // Optional: Show a notification when the tab is closed.
//     chrome.notifications.create({
//       type: "basic",
//       iconUrl: "icon.png",
//       title: "Twitter Detox Timer",
//       message: "Time's up! The Twitter tab has been closed.",
//     });
//   }