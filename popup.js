document.getElementById('block').addEventListener('click', function() {
    const websites = document.getElementById('websites').value.split(',');
    const blockDuration = parseInt(document.getElementById('time').value);
    const blockEndTime = new Date().getTime() + blockDuration * 60 * 1000;

    chrome.storage.local.get({ blockedWebsites: [] }, function(data) {
        const updatedWebsites = data.blockedWebsites.concat(
            websites.map(site => ({ site: site.trim(), blockEndTime }))
        );

        // Update local storage with the blocked websites
        chrome.storage.local.set({ blockedWebsites: updatedWebsites }, function() {
            // Send a message to the background script to block each website
            websites.forEach(site => {
                chrome.runtime.sendMessage({ action: 'blockWebsite', url: site.trim() }, (response) => {
                    console.log(response.message);  // Ensure we receive a response from background.js
                });
            });

            // Immediately update the UI to reflect blocked websites
            displayBlockedWebsites();
            alert('Websites blocked for ' + blockDuration + ' minutes');
        });
    });
});

document.getElementById('unblock-selected').addEventListener('click', function() {
    chrome.storage.local.get({ blockedWebsites: [] }, function(data) {
        const checkboxes = document.querySelectorAll('.unblock-checkbox:checked');
        const websitesToUnblock = Array.from(checkboxes).map(cb => cb.value);

        const updatedWebsites = data.blockedWebsites.filter(item => !websitesToUnblock.includes(item.site));

        // Update local storage after unblocking websites
        chrome.storage.local.set({ blockedWebsites: updatedWebsites }, function() {
            // Send a message to the background script to unblock the websites
            websitesToUnblock.forEach((site, index) => {
                chrome.runtime.sendMessage({ action: 'unblockWebsite', ruleId: index + 1 }, (response) => {
                    console.log(response.message);  // Ensure we receive a response from background.js
                });
            });

            // Immediately update the UI to reflect unblocked websites
            displayBlockedWebsites();
            alert('Selected websites have been unblocked');
        });
    });
});

function displayBlockedWebsites() {
    chrome.storage.local.get({ blockedWebsites: [] }, function(data) {
        const currentTime = new Date().getTime();
        const blockedWebsitesList = document.getElementById('blocked-websites-list');
        blockedWebsitesList.innerHTML = '';  // Clear the list

        if (data.blockedWebsites.length === 0) {
            blockedWebsitesList.innerHTML = '<li>No websites blocked</li>';
        } else {
            data.blockedWebsites.forEach(item => {
                const remainingTime = Math.max(0, Math.round((item.blockEndTime - currentTime) / 60000));
                const listItem = document.createElement('li');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'unblock-checkbox';
                checkbox.value = item.site;

                listItem.textContent = `${item.site} - ${remainingTime} minutes remaining`;
                listItem.prepend(checkbox);
                blockedWebsitesList.appendChild(listItem);
            });
        }
    });
}

// Load blocked websites when the popup is opened
document.addEventListener('DOMContentLoaded', displayBlockedWebsites);
