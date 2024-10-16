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

//     // Add the quote text to the paragraph
//     quoteElement.textContent = randomQuote;

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

const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Do or do not, there is no try.", category: "Motivation" }
];

// Function to display a random quote
function displayRandomQuote() {
    // Get a random quote from the array
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Display the random quote in the quoteDisplay div
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><small>${randomQuote.category}</small>`;
}

// Function to add a new quote to the array
function addQuote() {
    // Get values from input fields
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    // Validate input (make sure the quote text is not empty)
    if (newQuoteText === "") {
        alert("Please enter a valid quote!");
        return;
    }

    // Add the new quote to the array
    quotes.push({ text: newQuoteText, category: newQuoteCategory || "General" });

    // Clear the input fields
    document.getElementById('newQuoteText').value = "";
    document.getElementById('newQuoteCategory').value = "";

    // Optionally display the new quote
    displayRandomQuote();
}



// Add event listeners when the DOM content has fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for the "Show New Quote" button
    const newQuoteButton = document.getElementById('newQuote');
    newQuoteButton.addEventListener('click', displayRandomQuote);

    // Automatically display a random quote on page load
    displayRandomQuote();
});
