let ruleIdCounter = 1;

// Function to block a website
function blockWebsite(url) {
    const rule = {
        "id": ruleIdCounter++,
        "priority": 1,
        "action": { "type": "block" },
        "condition": {
            "urlFilter": url,
            "resourceTypes": ["main_frame"]
        }
    };

    // Add the rule to block the website
    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [rule],
        removeRuleIds: []
    }, () => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            console.log(`Blocked: ${url}`);
        }
    });
}

// Function to unblock a website using the rule ID
function unblockWebsite(ruleId) {
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [ruleId],
        addRules: []
    }, () => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            console.log(`Unblocked rule ID: ${ruleId}`);
        }
    });
}

// Handle incoming messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "blockWebsite") {
        blockWebsite(message.url);
        sendResponse({ status: 'success', message: `Blocked ${message.url}` });
    } else if (message.action === "unblockWebsite") {
        unblockWebsite(message.ruleId);
        sendResponse({ status: 'success', message: `Unblocked rule ID ${message.ruleId}` });
        }
    }
);
