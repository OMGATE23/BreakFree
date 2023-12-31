const CLIENT_URL = "https://get-break-free.vercel.app/"
chrome.runtime.onInstalled.addListener(({reason}) => {
    if (reason === 'install') {
        chrome.tabs.create({url : CLIENT_URL})
    }
  });


chrome.tabs.onUpdated.addListener(async (tabId , tab) => {

    
    if(tab){
        chrome.tabs.sendMessage(tabId,{
            type : "NEW",
            videoId : tab
        })
    }
    let obj = await getActiveTabURL()
})

async function getActiveTabURL(){
    let queryOptions = {active : true , currentWindow : true};
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
