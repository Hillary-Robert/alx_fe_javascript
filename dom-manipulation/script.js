document.addEventListener("DOMContentLoaded", () => {
  const quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
      { text: "Do what you can, with what you have, where you are.", category: "Inspiration" },
      { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
  ];

  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");

  function showRandomQuote() {
      if (quotes.length === 0) {
          quoteDisplay.innerHTML = "No quotes available. Please add one!";
          return;
      }
      let randomX = Math.floor(Math.random() * quotes.length);
      let randomQuotes = quotes[randomX];
      quoteDisplay.innerHTML = `<p><strong>${randomQuotes.category}:</strong> "${randomQuotes.text}"</p>`;
  }

  newQuoteBtn.addEventListener("click", showRandomQuote);





  const createAddQuoteForm = document.createElement("form");
  createAddQuoteForm.innerHTML = `
      <h1>Add Your own Quote</h1>
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" /> <br>
      <button type="button" id="addQuoteBtn">Add Quote</button>
      <p id="alertMessage" style="display: none;"></p>
  `;

  document.body.appendChild(createAddQuoteForm);

  let addBtn = document.getElementById("addQuoteBtn");
  addBtn.addEventListener("click", addQuote);

  function addQuote() {
      const newQuoteText = document.getElementById("newQuoteText").value.trim();
      const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
      const alertText = document.getElementById("alertMessage");
      

      if (newQuoteText === "" || newQuoteCategory === "") {
          alertText.innerText = "Please enter a quote and a category";
          alertText.style.color = "red";
          alertText.style.display = "block";
      } else {
          quotes.push({ text: newQuoteText, category: newQuoteCategory });
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

  showRandomQuote();
});
