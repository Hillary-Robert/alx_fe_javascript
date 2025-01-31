document.addEventListener("DOMContentLoaded", () => {
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "Do what you can, with what you have, where you are.", category: "Inspiration" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const categoryFilter = document.getElementById("categoryFilter");
    const exportQuotesBtn = document.getElementById("exportQuotes");

    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
        localStorage.setItem("categories", JSON.stringify([...new Set(quotes.map(q => q.category))]));
    }

    function populateCategories() {
        const categories = JSON.parse(localStorage.getItem("categories")) || [...new Set(quotes.map(q => q.category))];
        categoryFilter.innerHTML = `<option value="all">All Categories</option>` +
            categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
    }

    function showFilteredQuotes() {
        const selectedCategory = categoryFilter.value;
        localStorage.setItem("lastSelectedCategory", selectedCategory);
        const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
        
        if (filteredQuotes.length === 0) {
            quoteDisplay.innerHTML = "No quotes available for this category. Please add one!";
            return;
        }
        let randomX = Math.floor(Math.random() * filteredQuotes.length);
        let randomQuote = filteredQuotes[randomX];
        quoteDisplay.innerHTML = `<p><strong>${randomQuote.category}:</strong> "${randomQuote.text}"</p>`;
    }

    categoryFilter.addEventListener("change", showFilteredQuotes);

    categoryFilter.value = localStorage.getItem("lastSelectedCategory") || "all";
    populateCategories();
    showFilteredQuotes();

    newQuoteBtn.addEventListener("click", showFilteredQuotes);

    const createAddQuoteForm = document.createElement("form");
    createAddQuoteForm.innerHTML = `
        <h1>Add Your own Quote</h1>
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" /> <br>
        <button type="button" id="addQuoteBtn">Add Quote</button>
        <p id="alertMessage" style="display: none;"></p> 
    `;
    document.body.appendChild(createAddQuoteForm);

    document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

    function addQuote() {
        const newQuoteText = document.getElementById("newQuoteText").value.trim();
        const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
        const alertText = document.getElementById("alertMessage");

        if (!alertText) return;

        if (newQuoteText === "" || newQuoteCategory === "") {
            alertText.innerText = "Please enter a quote and a category";
            alertText.style.color = "red";
            alertText.style.display = "block";
        } else {
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            saveQuotes();
            populateCategories();
            document.getElementById("newQuoteText").value = "";
            document.getElementById("newQuoteCategory").value = "";
            alertText.innerText = "Quote and Category successfully added";
            alertText.style.color = "green";
            alertText.style.display = "block";
        }

        setTimeout(() => {
            alertText.style.display = "none";
        }, 3000);
    }

    function exportToJsonFile() {
        const dataStr = JSON.stringify(quotes, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "quotes.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    exportQuotesBtn.addEventListener("click", exportToJsonFile);
});
