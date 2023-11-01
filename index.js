import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://bookmarked-3cdfe-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const quotesListInDB = ref(database, "QuotesList")

const inputQuotes = document.getElementById("input-quotes")
const inputName = document.getElementById("input-book-name")
const inputAuthor = document.getElementById("input-author")
const saveButton = document.getElementById("save-button")
const quotesList = document.getElementById("quotes-list")

function getAllInputs() {
    const quoteContainer = {
        name: inputName.value,
        author: inputAuthor.value,
        quote: inputQuotes.value
    }
    return quoteContainer
}

saveButton.addEventListener("click", function() {
    if (inputQuotes.value === "") {
        window.alert("No quote has been entered.")
    } else {
        let quotesValue = getAllInputs()

        if (inputName.value === "") {
            quotesValue.name = "Unknown";
        }
        if (inputAuthor.value === "") {
            quotesValue.author = "Unknown";
        }

        push(quotesListInDB, quotesValue)
        clearInputField()
    }
})

onValue(quotesListInDB, function(snapshot) {

    if (snapshot.exists()) {
        let quotesArray = Object.entries(snapshot.val())
        clearQuotesField()

        for (let i = 0; i < quotesArray.length; i++) {
            let currentQuote = quotesArray[i]
            
            appendQuote(currentQuote)
        }
    } else {
        quotesList.innerHTML = `<p style="color: #8F8F8F; text-align: center;">Here will be a list of your favourite quotes.</p>`
    }

})

function clearQuotesField() {
   quotesList.innerHTML = ""
 }

function clearInputField() {
    inputName.value = ""
    inputAuthor.value = ""
    inputQuotes.value = ""
}

function appendQuote(quote) {
    let quoteValue = quote[1]
    
    let newQuote = document.createElement("li")
    
    newQuote.innerHTML = `
    <div class="details">
        <h5>Book name: ${quoteValue.name}</h5>
        <h5>Author: ${quoteValue.author}</h5>
    </div>
        <p>${quoteValue.quote}</p>
        `
    
    quotesList.insertBefore(newQuote, quotesList.firstChild)
    
    newQuote.addEventListener("dblclick", function() {
        let exactLocationInBD = ref(database, `QuotesList/${quote[0]}`)
        remove(exactLocationInBD)
    })
}

