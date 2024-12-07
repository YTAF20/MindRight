document.addEventListener("DOMContentLoaded", () => {
    const blockButton = document.getElementById('blockButton');
    const urlInput = document.getElementById('urlInput');
    const timeInput = document.getElementById('timeInput');
    const messageDiv = document.getElementById('message');
    const blockedList = document.getElementById('blockedList');

    loadBlockedUrls();

    //Check to see if information is entered in the correct format
    blockButton.addEventListener('click', () => {
        let url = urlInput.value.trim();

        if (!url.startsWith('http')) {
            url = `http://${url}`;
        }
        try {
            const parsedUrl = new URL(url);
            const domain = parsedUrl.hostname;
            if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)) {
                messageDiv.textContent = 'Please enter a valid URL; www.example.com';
                return;
            }
            const time = parseInt(timeInput.value.trim());
            if (isNaN(time) || time <= 0) {
                messageDiv.textContent = 'Please enter a valid time in minutes.';
                return;
            }
            chrome.storage.sync.get('blockedUrls', (data) => {
                const blockedUrls = data.blockedUrls || [];

                if (blockedUrls.some(block => block.url === domain)) {
                    messageDiv.textContent = 'Website already blocked.';
                    return;
                }

                const expiration = Date.now() + time * 60000;

                blockedUrls.push({ url: domain, expiration });
                chrome.storage.sync.set({ blockedUrls }, () => {
                    messageDiv.textContent = 'Website blocked successfully!';
                    urlInput.value = '';
                    timeInput.value = '';

                    displayBlockedUrl(domain, expiration);
                });

                chrome.alarms.create(domain, { when: expiration });
            });
        } catch (error) {
            messageDiv.textContent = 'Invalid format or missing field';
        }
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
