document.addEventListener("DOMContentLoaded", function () {
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Perseverance" }
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    const categoryFilter = document.getElementById("categoryFilter");

    async function fetchQuotesFromServer() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/posts");
            const data = await response.json();
            const serverQuotes = data.slice(0, 5).map(post => ({ text: post.title, category: "Server Data" }));
            quotes = [...quotes, ...serverQuotes];
            localStorage.setItem("quotes", JSON.stringify(quotes));
            populateCategories();
            showRandomQuote();
        } catch (error) {
            console.error("Error fetching quotes from server:", error);
        }
    }

    async function postQuoteToServer(quote) {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(quote)
            });
            const result = await response.json();
            console.log("Quote posted successfully:", result);
        } catch (error) {
            console.error("Error posting quote to server:", error);
        }
    }

    async function syncQuotes() {
        await fetchQuotesFromServer();
        quotes.forEach(postQuoteToServer);
    }

    function populateCategories() {
        const categories = ["All Categories", ...new Set(quotes.map(q => q.category))];
        categoryFilter.innerHTML = "";
        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            categoryFilter.appendChild(option);
        });
    }

    function showRandomQuote() {
        let filteredQuotes = categoryFilter.value === "All Categories" ? quotes : quotes.filter(q => q.category === categoryFilter.value);
        if (filteredQuotes.length === 0) {
            quoteDisplay.innerHTML = "No quotes available for this category.";
            return;
        }
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        quoteDisplay.innerHTML = `<p>${filteredQuotes[randomIndex].text}</p><p><em>(${filteredQuotes[randomIndex].category})</em></p>`;
        sessionStorage.setItem("lastViewedQuote", JSON.stringify(filteredQuotes[randomIndex]));
    }

    function filterQuotes() {
        localStorage.setItem("selectedCategory", categoryFilter.value);
        showRandomQuote();
    }

    function addQuote() {
        const quoteText = document.getElementById("newQuoteText").value.trim();
        const quoteCategory = document.getElementById("newQuoteCategory").value.trim();
        if (quoteText === "" || quoteCategory === "") {
            alert("Please enter both a quote and a category.");
            return;
        }
        const newQuote = { text: quoteText, category: quoteCategory };
        quotes.push(newQuote);
        localStorage.setItem("quotes", JSON.stringify(quotes));
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        populateCategories();
        showRandomQuote();
        postQuoteToServer(newQuote);
    }

    function loadStoredPreferences() {
        const storedCategory = localStorage.getItem("selectedCategory");
        if (storedCategory) {
            categoryFilter.value = storedCategory;
        }
    }

    newQuoteButton.addEventListener("click", showRandomQuote);
    categoryFilter.addEventListener("change", filterQuotes);

    populateCategories();
    loadStoredPreferences();
    showRandomQuote();
    fetchQuotesFromServer();
    syncQuotes();

    setInterval(syncQuotes, 60000); // Sync every 60 seconds
});
