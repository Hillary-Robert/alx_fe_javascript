document.addEventListener("DOMContentLoaded", () => {
  const quotes = [

      { text: "The only limit to our realization of tomorrow is our doubts of today.", 
        category: "Motivation" 
      },

      { text: "Do what you can, with what you have, where you are.", 
        category: "Inspiration" 
      },

      { 
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", 
        category: "Success" 
      }
  ];

  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");

  function showRandomQuote(){

    if(quotes.length == 0 || quotes.length == null){
      quoteDisplay.innerHTML = "No available quotes, Please enter quote"

      return;
    }else{
      let randomX = Math.floor(Math.random() * quotes.length)
      let randomQuotes = quotes[randomX];
      quoteDisplay.innerHTML = `<p><strong>${randomQuotes.category}:</strong> "${randomQuotes.text}"</p>`
    }


  }



  newQuoteBtn.addEventListener("click", showRandomQuote)







  function CreateAddQuoteForm(){
    const formContainer = document.createElement("div")
    formContainer.innerHTML = `<h1>Add Your own Quote</h1> <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>`;

    document.body.appendChild(formContainer);

    document.getElementById("addQuoteBtn").addEventListener("click", addQuote)
  }


  function addQuote(){
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
    const alertText = document.createElement("div")
    let ParagraphText = document.createElement("p")
    alertText.appendChild(ParagraphText)

    document.body.appendChild(alertText)

    if(newQuoteText == "" || newQuoteCategory == ""){
      ParagraphText.innerText = "Please enter a quote and a category" 
      ParagraphText.style.color ="red"
        setTimeout(() => {
          ParagraphText.style.display = "none";
      }, 3000);
      return;
    }else{

      quotes.push({text: newQuoteText, category: newQuoteCategory})
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      ParagraphText.innerText = "Quote and Category successfully added" 
      ParagraphText.style.color ="green"

      setTimeout(() => {
        ParagraphText.style.display = "none";
    }, 3000);
    }
  }


  CreateAddQuoteForm()
  

})