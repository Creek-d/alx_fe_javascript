document.addEventListener("DOMContentLoaded", function () {
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Perseverance" }
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    const categoryFilter = document.getElementById("categoryFilter");

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
        quotes.push({ text: quoteText, category: quoteCategory });
        localStorage.setItem("quotes", JSON.stringify(quotes));
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        populateCategories();
        showRandomQuote();
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
});
