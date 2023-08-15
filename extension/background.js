//chrome.tabs.create({url : "http://localhost:5173/"})
chrome.runtime.onInstalled.addListener(({reason}) => {
    if (reason === 'install') {
        chrome.tabs.create({url : "http://localhost:5173/"})
    }
  });


chrome.tabs.onUpdated.addListener(async (tabId , tab) => {

    console.log({tab , tabId})
    
    if(tab){
        console.log('tried sending message' , tab)
        chrome.tabs.sendMessage(tabId,{
            type : "NEW",
            videoId : tab
        })
    }
    
    if(tab.url){
        console.log(tab.url)

        
    }
    let obj = await getActiveTabURL()

    

})

async function getActiveTabURL(){
    let queryOptions = {active : true , currentWindow : true};
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
