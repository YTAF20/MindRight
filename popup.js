document.addEventListener("DOMContentLoaded", () => {
    const blockButton = document.getElementById('blockButton');
    const urlInput = document.getElementById('urlInput');
    const timeInput = document.getElementById('timeInput');
    const messageDiv = document.getElementById('message');
    const blockedList = document.getElementById('blockedList');

    loadBlockedUrls();

    blockButton.addEventListener('click', () => {
        const url = urlInput.value.trim();
        const time = parseInt(timeInput.value.trim());

        if (!url || isNaN(time) || time <= 0) {
            messageDiv.textContent = 'Please enter a valid URL and time in minutes.';
            return;
        }

        chrome.storage.sync.get('blockedUrls', (data) => {
            const blockedUrls = data.blockedUrls || [];

            if (blockedUrls.some(block => block.url === url)) {
                messageDiv.textContent = 'URL already blocked.';
                return;
            }

            const expiration = Date.now() + time * 60000; 

            blockedUrls.push({ url, expiration });
            chrome.storage.sync.set({ blockedUrls }, () => {
                messageDiv.textContent = 'URL blocked successfully!';
                urlInput.value = '';
                timeInput.value = '';

                displayBlockedUrl(url, expiration);
            });

            chrome.alarms.create(url, { when: expiration });
        });
    });
});

// Function to load and display blocked URLs with time left
const loadBlockedUrls = () => {
    chrome.storage.sync.get('blockedUrls', (data) => {
        const blockedUrls = data.blockedUrls || [];
        blockedUrls.forEach(({ url, expiration }) => {
            displayBlockedUrl(url, expiration);
        });
    });
};

// Function to display a blocked URL and calculate remaining time
const displayBlockedUrl = (url, expiration) => {
    const blockedList = document.getElementById('blockedList');
    const timeLeft = Math.max(0, Math.floor((expiration - Date.now()) / 1000)); // Time left in seconds
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const li = document.createElement('li');
    li.textContent = `${url} - Time left: ${minutes}m ${seconds}s`;
    blockedList.appendChild(li);

    setInterval(() => {
        const updatedTimeLeft = Math.max(0, Math.floor((expiration - Date.now()) / 1000));
        const updatedMinutes = Math.floor(updatedTimeLeft / 60);
        const updatedSeconds = updatedTimeLeft % 60;

        li.textContent = `${url} - Time left: ${updatedMinutes}m ${updatedSeconds}s`;

       
        if (updatedTimeLeft <= 0) {
            li.remove(); 
        }
    }, 1000);
};
