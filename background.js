chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "openOptionsPage") {
      chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
    }
  });
  
  chrome.alarms.onAlarm.addListener((alarm) => {
    const url = alarm.name;
    
    chrome.storage.sync.get('blockedUrls', (data) => {
      const blockedUrls = (data.blockedUrls || []).filter(block => block.url !== url);
      chrome.storage.sync.set({ blockedUrls });
    });
  });
  