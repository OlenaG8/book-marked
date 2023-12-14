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
    let newQuote = createQuoteElement(quoteValue)

    quotesList.insertBefore(newQuote, quotesList.firstChild);
    
    newQuote.addEventListener("dblclick", function() {
        let exactLocationInBD = ref(database, `QuotesList/${quote[0]}`)
        remove(exactLocationInBD)
    })
}

function createQuoteElement(quoteValue) {
    let newQuote = document.createElement("li")
    let details = document.createElement("div")
    details.className = "details"

    let bookName = document.createElement("h5")
    bookName.textContent = `Book name: ${quoteValue.name}`

    let author = document.createElement("h5")
    author.textContent = `Author: ${quoteValue.author}`
    
    let quoteText = document.createElement("p")
    quoteText.textContent = quoteValue.quote

    details.appendChild(bookName)
    details.appendChild(author)
    newQuote.appendChild(details)
    newQuote.appendChild(quoteText)

    return newQuote
}

