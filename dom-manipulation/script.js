document.addEventListener("DOMContentLoaded", function () {
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Perseverance" },
        { text: "Hard work beats talent when talent doesn't work hard.", category: "Success" },
        { text: "The best way to get started is to quit talking and begin doing.", category: "Action" }
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

        const newQuote = { text: quoteText, category: quoteCategory };
        quotes.push(newQuote);
        localStorage.setItem("quotes", JSON.stringify(quotes));

        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";

        populateCategories();
        showRandomQuote();
    }

    function exportQuotes() {
        const quotesData = JSON.stringify(quotes, null, 4);
        const blob = new Blob([quotesData], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "quotes.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        alert("Quotes exported successfully!");
    }

    function importFromJsonFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const importedQuotes = JSON.parse(e.target.result);
                if (!Array.isArray(importedQuotes)) throw new Error("Invalid JSON format");

                quotes = [...quotes, ...importedQuotes];
                localStorage.setItem("quotes", JSON.stringify(quotes));
                populateCategories();
                showRandomQuote();
                alert("Quotes imported successfully!");
            } catch (error) {
                alert("Error importing file. Please ensure it's a valid JSON file.");
            }
        };
        reader.readAsText(file);
    }

    newQuoteButton.addEventListener("click", showRandomQuote);
    document.getElementById("addQuote").addEventListener("click", addQuote);
    document.getElementById("exportQuotes").addEventListener("click", exportQuotes);

    populateCategories();
    showRandomQuote();
});
