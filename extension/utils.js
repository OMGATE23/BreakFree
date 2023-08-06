export async function getActiveTabURL(){
    let queryOptions = {active : true , currentWindow : true};
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log('getActiveTabURL func() =>' , tab.url)
    return tab;
}