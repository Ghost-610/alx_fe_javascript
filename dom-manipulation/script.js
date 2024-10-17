// // Array of quotes
// const quotes = [
//     "Be yourself; everyone else is already taken. - Oscar Wilde",
//     "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe. - Albert Einstein",
//     "Be the change that you wish to see in the world. - Mahatma Gandhi",
//     "Without music, life would be a mistake. - Friedrich Nietzsche",
//     "You only live once, but if you do it right, once is enough. - Mae West",
//     "In three words I can sum up everything I've learned about life: it goes on. - Robert Frost",
//     "If you tell the truth, you don't have to remember anything. - Mark Twain",
//     "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. - Ralph Waldo Emerson",
//     "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
//     "The only way to do great work is to love what you do. - Steve Jobs",
//     "Quality is REMEMBERED when PRICE is far FORGOTTEN -ELORM_GERSHON"

// ];

// // Get references to HTML elements
// const quoteDisplay = document.getElementById('quoteDisplay');
// const newQuoteButton = document.getElementById('newQuote');

// // Function to generate a random quote
// function generateQuote() {
//     // Generate a random index
//     const randomIndex = Math.floor(Math.random() * quotes.length);

//     // Get the quote at that index
//     const randomQuote = quotes[randomIndex];

//     // Create a new paragraph element
//     const quoteElement = document.createElement('p');

// Add the quote text to the paragraph
// quoteElement.textContent = randomQuote;

//     // Style the quote
//     quoteElement.style.fontSize = '18px';
//     quoteElement.style.fontStyle = 'italic';
//     quoteElement.style.color = '#333';
//     quoteElement.style.padding = '20px';
//     quoteElement.style.backgroundColor = '#f9f9f9';
//     quoteElement.style.borderLeft = '5px solid #007bff';
//     quoteElement.style.margin = '20px 0';

//     // Clear previous quote
//     quoteDisplay.innerHTML = '';

//     // Add the new quote
//     quoteDisplay.appendChild(quoteElement);

//     // Add fade-in animation
//     quoteElement.style.opacity = '0';
//     quoteElement.style.transition = 'opacity 0.5s ease-in';

//     // Trigger fade-in
//     setTimeout(() => {
//         quoteElement.style.opacity = '1';
//     }, 50);
// }

// // Add click event listener to button
// newQuoteButton.addEventListener('click', generateQuote);

// // Generate initial quote when page loads
// generateQuote();

// Array to store quotes
class Quote {
    constructor(text, category) {
        this.text = text;
        this.category = category;
    }
}

class QuoteManager {
    constructor() {
        this.quotes = [
            new Quote("The only way to do great work is to love what you do.", "Motivation"),
            new Quote("Life is what happens when you're busy making other plans.", "Life"),
            new Quote("You miss 100% of the shots you don't take.", "Sports"),
            new Quote("The only limit to our realization of tomorrow is our doubts of today.", "Inspiration"),
            new Quote("Do or do not, there is no try.", "Motivation")
        ];
        this.initializeEventListeners();
    }

    createAddQuoteForm() {
        const formDiv = document.createElement('div');
        formDiv.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
      `;
        return formDiv;
    }

    initializeEventListeners() {
        const showNewQuoteBtn = document.querySelector('button#newQuote') || document.getElementById('newQuote');
        if (showNewQuoteBtn) {
            showNewQuoteBtn.addEventListener('click', () => this.showRandomQuote());
            console.log('Show New Quote button listener attached');
        } else {
            console.error('Show New Quote button not found');
        }
    }

    showRandomQuote() {
        console.log('showRandomQuote called');
        if (this.quotes.length === 0) {
            this.showError('No quotes available');
            return;
        }

        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        const randomQuote = this.quotes[randomIndex];
        const quoteDisplay = document.getElementById('quoteDisplay');

        if (quoteDisplay) {
            console.log('Displaying quote:', randomQuote);
            quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
        } else {
            console.error('Quote display element not found');
        }
    }

    addQuote() {
        const newQuoteText = document.getElementById('newQuoteText');
        const newQuoteCategory = document.getElementById('newQuoteCategory');

        if (!newQuoteText || !newQuoteCategory) {
            this.showError('Form elements not found');
            return;
        }

        const text = newQuoteText.value.trim();
        const category = newQuoteCategory.value.trim();

        if (!text || !category) {
            this.showError('Please enter both a quote and a category.');
            return;
        }

        const newQuote = new Quote(text, category);
        this.quotes.push(newQuote);
        console.log('New quote added:', newQuote);

        newQuoteText.value = '';
        newQuoteCategory.value = '';

        this.showSuccess('Quote added successfully!');
    }

    showSuccess(message) {
        alert(message);
    }

    showError(message) {
        alert(message);
    }
}

// Initialize the quote manager
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing QuoteManager');
    window.quoteManager = new QuoteManager();
});

// Export the addQuote function for the HTML button
function addQuote() {
    if (window.quoteManager) {
        window.quoteManager.addQuote();
    } else {
        console.error('QuoteManager not initialized');
    }
}
