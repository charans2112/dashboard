document.addEventListener("DOMContentLoaded", function () {
    let chatData = [];
    const chatList = document.getElementById("chatList");
    const searchBox = document.getElementById("searchBox");
    const senderFilter = document.getElementById("senderFilter");
    const fromDate = document.getElementById("fromDate");
    const toDate = document.getElementById("toDate");
    const sortOrder = document.getElementById("sortOrder");
    const themeToggle = document.getElementById("themeToggle");

    // Load JSON data
    fetch("chat.json")
        .then(response => response.json())
        .then(data => {
            chatData = data.map(chat => ({
                ...chat,
                date: new Date(chat.date) // Convert string date to Date object
            }));
            populateSenderFilter();
            renderChat();
        });

    function populateSenderFilter() {
        senderFilter.innerHTML = `<option value="">Select Sender</option>`;
        const senders = [...new Set(chatData.map(chat => chat.sender))];
        senders.forEach(sender => {
            let option = document.createElement("option");
            option.value = sender;
            option.textContent = sender;
            senderFilter.appendChild(option);
        });
    }

    function renderChat() {
        chatList.innerHTML = "";

        // Get filter values
        const searchText = searchBox.value.toLowerCase();
        const selectedSender = senderFilter.value;
        const fromDateValue = fromDate.value ? new Date(fromDate.value) : null;
        const toDateValue = toDate.value ? new Date(toDate.value) : null;
        const sortValue = sortOrder.value;

        // Apply filters
        let filteredData = chatData.filter(chat => {
            const messageMatches = chat.message.toLowerCase().includes(searchText);
            const senderMatches = selectedSender ? chat.sender === selectedSender : true;
            const dateMatches =
                (!fromDateValue || chat.date >= fromDateValue) &&
                (!toDateValue || chat.date <= toDateValue);

            return messageMatches && senderMatches && dateMatches;
        });

        // Apply sorting
        if (sortValue === "newest") {
            filteredData.sort((a, b) => b.date - a.date);
        } else {
            filteredData.sort((a, b) => a.date - b.date);
        }

        // Render messages
        filteredData.forEach(chat => {
            let div = document.createElement("div");
            div.classList.add("chat-message", chat.sender === "Chinni" ? "sent" : "received");

            div.innerHTML = `
                <img src="${chat.profilePic || 'default-avatar.jpg'}" class="profile-pic">
                <div class="message-text">${chat.message}</div>
            `;

            chatList.appendChild(div);
        });

        chatList.scrollTop = chatList.scrollHeight;
    }

    // Event listeners for filtering
    searchBox.addEventListener("input", renderChat);
    senderFilter.addEventListener("change", renderChat);
    fromDate.addEventListener("change", renderChat);
    toDate.addEventListener("change", renderChat);
    sortOrder.addEventListener("change", renderChat);

    // Dark mode toggle
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
    
        // Force a repaint for chat name and username to apply transition smoothly
        const chatNames = document.querySelectorAll(".chat-name, .username");
        chatNames.forEach(el => {
            el.style.display = "none"; // Temporarily hide
            void el.offsetHeight; // Force reflow
            el.style.display = ""; // Restore display
        });
    });    
});
