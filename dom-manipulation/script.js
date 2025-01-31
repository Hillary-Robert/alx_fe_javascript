document.addEventListener("DOMContentLoaded", () => {
  let quotes = JSON.parse(localStorage.getItem("quotes")) || [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
      { text: "Do what you can, with what you have, where you are.", category: "Inspiration" },
      { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
  ];

  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");

  function saveQuotes() {
      localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  function showRandomQuote() {
      if (quotes.length === 0) {
          quoteDisplay.innerHTML = "No quotes available. Please add one!";
          return;
      }
      let randomX = Math.floor(Math.random() * quotes.length);
      let randomQuotes = quotes[randomX];
      quoteDisplay.innerHTML = `<p><strong>${randomQuotes.category}:</strong> "${randomQuotes.text}"</p>`;
      sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuotes)); // Save last viewed quote
  }

  // Load last viewed quote if available
  const lastViewedQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
  if (lastViewedQuote) {
      quoteDisplay.innerHTML = `<p><strong>${lastViewedQuote.category}:</strong> "${lastViewedQuote.text}"</p>`;
  }

  newQuoteBtn.addEventListener("click", showRandomQuote);

  const createAddQuoteForm = document.createElement("form");
  createAddQuoteForm.innerHTML = `
      <h1>Add Your own Quote</h1>
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" /> <br>
      <button type="button" id="addQuoteBtn">Add Quote</button>
      <p id="alertMessage" style="display: none;"></p> <br>
      <button type="button" id="exportQuotes">Export JSON</button>
      <input type="file" id="importFile" accept=".json" />
  `;
  document.body.appendChild(createAddQuoteForm);

  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
  document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);

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

  function importFromJsonFile(event) {
      const fileReader = new FileReader();
      fileReader.onload = function (event) {
          try {
              const importedQuotes = JSON.parse(event.target.result);

              // Validate imported data
              if (!Array.isArray(importedQuotes) || !importedQuotes.every(q => q.text && q.category)) {
                  alert("Invalid JSON format. Ensure each quote has 'text' and 'category' properties.");
                  return;
              }

              quotes.push(...importedQuotes);
              saveQuotes();
              alert("Quotes imported successfully!");
          } catch (error) {
              alert("Error parsing JSON file.");
          }
      };
      fileReader.readAsText(event.target.files[0]);
  }

  showRandomQuote();
});
