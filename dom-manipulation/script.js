document.addEventListener("DOMContentLoaded", function () {
    // Quote array with categories
    let quotes = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Perseverance" }
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    
    // Function to display a random quote
    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.textContent = "No quotes available. Please add some!";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteDisplay.textContent = `${quotes[randomIndex].text} - (${quotes[randomIndex].category})`;
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

        formContainer.appendChild(quoteInput);
        formContainer.appendChild(categoryInput);
        formContainer.appendChild(addButton);
        
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
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        showRandomQuote();
    }

    createAddQuoteForm();
});
