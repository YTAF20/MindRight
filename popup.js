document.addEventListener("DOMContentLoaded", () => {
    const blockButton = document.getElementById('blockButton');
    const urlInput = document.getElementById('urlInput');
    const timeInput = document.getElementById('timeInput');
    const messageDiv = document.getElementById('message');
    const blockedList = document.getElementById('blockedList');

    loadBlockedUrls();

    blockButton.addEventListener('click', () => {
        let url = urlInput.value.trim();
        const time = parseInt(timeInput.value.trim());
        //Normalize the URL sub block subdomains 
        if (!url.startsWith('http')) {
            url = `http://${url}`; 
        }

        try {
            const parsedUrl = new URL(url);
            const rootDomain = parsedUrl.hostname.replace(/^www\./, ''); // Extract root domain

            if (!rootDomain) {
                messageDiv.textContent = 'Please enter a valid URL.';
                return;
            }

            if (isNaN(time) || time <= 0) {
                messageDiv.textContent = 'Please enter a valid time in minutes.';
                return;
            }

            chrome.storage.sync.get('blockedUrls', (data) => {
                const blockedUrls = data.blockedUrls || [];

                if (blockedUrls.some(block => block.url === rootDomain)) {
                    messageDiv.textContent = 'Domain already blocked.';
                    return;
                }

                const expiration = Date.now() + time * 60000;

                blockedUrls.push({ url: rootDomain, expiration });
                chrome.storage.sync.set({ blockedUrls }, () => {
                    messageDiv.textContent = 'Domain blocked successfully!';
                    urlInput.value = '';
                    timeInput.value = '';

                    displayBlockedUrl(rootDomain, expiration);
                });

                chrome.alarms.create(rootDomain, { when: expiration });
            });
        } catch (error) {
            messageDiv.textContent = 'Invalid URL format.';
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
