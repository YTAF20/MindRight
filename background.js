//Listens to when the user wants to access the options page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "openOptionsPage") {
      chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
    }
  });
  
  //Checks when a block time expires 
  chrome.alarms.onAlarm.addListener((alarm) => {
    const url = alarm.name;
    
    //Retrieves the blocked URL from storage
    chrome.storage.sync.get('blockedUrls', (data) => {
      const blockedUrls = (data.blockedUrls || []).filter(block => block.url !== url);
      chrome.storage.sync.set({ blockedUrls });
    });
  });
  