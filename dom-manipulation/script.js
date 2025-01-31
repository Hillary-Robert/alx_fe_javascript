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
    const formContainer = document.createElement("div");
    formContainer.id = "formContainer";
    document.body.appendChild(formContainer);

    const syncStatus = document.createElement("p");
    syncStatus.id = "syncStatus";
    document.body.appendChild(syncStatus);

    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
        localStorage.setItem("categories", JSON.stringify([...new Set(quotes.map(q => q.category))]));
    }

    function populateCategories() {
        const categories = JSON.parse(localStorage.getItem("categories")) || [...new Set(quotes.map(q => q.category))];
        categoryFilter.innerHTML = `<option value="all">All Categories</option>` +
            categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
    }

    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        localStorage.setItem("lastSelectedCategory", selectedCategory);
        const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
        
        if (filteredQuotes.length === 0) {
            quoteDisplay.textContent = "No quotes available for this category. Please add one!";
            return;
        }
        let randomX = Math.floor(Math.random() * filteredQuotes.length);
        let randomQuote = filteredQuotes[randomX];
        quoteDisplay.textContent = `${randomQuote.category}: "${randomQuote.text}"`;
    }

    async function fetchQuotesFromServer() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/posts"); 
            const serverQuotes = await response.json();
            
            if (Array.isArray(serverQuotes)) {
                const newQuotes = serverQuotes.map(q => ({ text: q.title, category: "Server Data" }));
                quotes = [...quotes, ...newQuotes];
                saveQuotes();
                populateCategories();
                filterQuotes();
                syncStatus.textContent = "Quotes synced with server!";
            }
        } catch (error) {
            console.error("Error fetching quotes from server:", error);
        }
    }

    async function postQuoteToServer(quote) {
        try {
            await fetch("https://jsonplaceholder.typicode.com/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(quote)
            });
            syncStatus.textContent = "Quote successfully posted to server!";
        } catch (error) {
            console.error("Error posting quote to server:", error);
        }
    }

    async function syncQuotes() {
        await fetchQuotesFromServer();
    }

    setInterval(syncQuotes, 60000); 

    categoryFilter.addEventListener("change", filterQuotes);
    newQuoteBtn.addEventListener("click", filterQuotes);

    categoryFilter.value = localStorage.getItem("lastSelectedCategory") || "all";
    populateCategories();
    filterQuotes();

    const createAddQuoteForm = document.createElement("form");
    createAddQuoteForm.innerHTML = `
        <h1>Add Your own Quote</h1>
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" /> <br>
        <button type="button" id="addQuoteBtn">Add Quote</button>
        <p id="alertMessage" style="display: none;"></p> 
    `;
    formContainer.appendChild(createAddQuoteForm);

    document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

    function addQuote() {
        const newQuoteText = document.getElementById("newQuoteText").value.trim();
        const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
        const alertText = document.getElementById("alertMessage");

        if (!alertText) return;

        if (newQuoteText === "" || newQuoteCategory === "") {
            alertText.textContent = "Please enter a quote and a category";
            alertText.style.color = "red";
            alertText.style.display = "block";
        } else {
            const newQuote = { text: newQuoteText, category: newQuoteCategory };
            quotes.push(newQuote);
            saveQuotes();
            populateCategories();
            postQuoteToServer(newQuote);
            document.getElementById("newQuoteText").value = "";
            document.getElementById("newQuoteCategory").value = "";
            alertText.textContent = "Quote and Category successfully added";
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
