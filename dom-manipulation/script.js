document.addEventListener("DOMContentLoaded", function () {
    // Load existing quotes from local storage
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Perseverance" }
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    const importFileInput = document.createElement("input");
    importFileInput.type = "file";
    importFileInput.id = "importFile";
    importFileInput.accept = ".json";
    importFileInput.onchange = importFromJsonFile;
    document.body.appendChild(importFileInput);

    // Function to save quotes to local storage
    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }
    
    // Function to display a random quote
    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "No quotes available. Please add some!";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteDisplay.innerHTML = `<p>${quotes[randomIndex].text}</p><p><em>(${quotes[randomIndex].category})</em></p>`;
        sessionStorage.setItem("lastViewedQuote", JSON.stringify(quotes[randomIndex]));
    }
    
    newQuoteButton.addEventListener("click", showRandomQuote);
    showRandomQuote(); // Show an initial quote

    // Function to create a form for adding new quotes
    function createAddQuoteForm() {
        const formContainer = document.createElement("div");
        
        const quoteInput = document.createElement("input");
        quoteInput.id = "newQuoteText";
        quoteInput.type = "text";
        quoteInput.placeholder = "Enter a new quote";

        const categoryInput = document.createElement("input");
        categoryInput.id = "newQuoteCategory";
        categoryInput.type = "text";
        categoryInput.placeholder = "Enter quote category";

        const addButton = document.createElement("button");
        addButton.textContent = "Add Quote";
        addButton.addEventListener("click", addQuote);

        const exportButton = document.createElement("button");
        exportButton.textContent = "Export Quotes";
        exportButton.addEventListener("click", exportToJsonFile);
        
        formContainer.appendChild(quoteInput);
        formContainer.appendChild(categoryInput);
        formContainer.appendChild(addButton);
        formContainer.appendChild(exportButton);
        
        document.body.appendChild(formContainer);
    }

    // Function to add a new quote
    function addQuote() {
        const quoteText = document.getElementById("newQuoteText").value.trim();
        const quoteCategory = document.getElementById("newQuoteCategory").value.trim();
        
        if (quoteText === "" || quoteCategory === "") {
            alert("Please enter both a quote and a category.");
            return;
        }
        
        quotes.push({ text: quoteText, category: quoteCategory });
        saveQuotes();
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        showRandomQuote();
    }

    // Function to export quotes to a JSON file
    function exportToJsonFile() {
        const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "quotes.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Function to import quotes from a JSON file
    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            alert("Quotes imported successfully!");
        };
        fileReader.readAsText(event.target.files[0]);
    }

    createAddQuoteForm();
});
