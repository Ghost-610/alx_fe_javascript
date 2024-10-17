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


// class Quote {
//     constructor(text, category) {
//         this.text = text;
//         this.category = category;
//     }
// }

// class QuoteManager {
//     constructor() {
//         this.quotes = [
//             new Quote("The only way to do great work is to love what you do.", "Motivation"),
//             new Quote("Life is what happens when you're busy making other plans.", "Life"),
//             new Quote("You miss 100% of the shots you don't take.", "Sports"),
//             new Quote("The only limit to our realization of tomorrow is our doubts of today.", "Inspiration"),
//             new Quote("Do or do not, there is no try.", "Motivation")
//         ];
//         this.initializeEventListeners();
//     }

//     createAddQuoteForm() {
//         const formDiv = document.createElement('div');
//         formDiv.innerHTML = `
//         <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
//         <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
//         <button onclick="addQuote()">Add Quote</button>
//       `;
//         return formDiv;
//     }

//     initializeEventListeners() {
//         const showNewQuoteBtn = document.querySelector('button#newQuote') || document.getElementById('newQuote');
//         if (showNewQuoteBtn) {
//             showNewQuoteBtn.addEventListener('click', () => this.showRandomQuote());
//             console.log('Show New Quote button listener attached');
//         } else {
//             console.error('Show New Quote button not found');
//         }
//     }

//     showRandomQuote() {
//         console.log('showRandomQuote called');
//         if (this.quotes.length === 0) {
//             this.showError('No quotes available');
//             return;
//         }

//         const randomIndex = Math.floor(Math.random() * this.quotes.length);
//         const randomQuote = this.quotes[randomIndex];
//         const quoteDisplay = document.getElementById('quoteDisplay');

//         if (quoteDisplay) {
//             console.log('Displaying quote:', randomQuote);
//             quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
//         } else {
//             console.error('Quote display element not found');
//         }
//     }

//     addQuote() {
//         const newQuoteText = document.getElementById('newQuoteText');
//         const newQuoteCategory = document.getElementById('newQuoteCategory');

//         if (!newQuoteText || !newQuoteCategory) {
//             this.showError('Form elements not found');
//             return;
//         }

//         const text = newQuoteText.value.trim();
//         const category = newQuoteCategory.value.trim();

//         if (!text || !category) {
//             this.showError('Please enter both a quote and a category.');
//             return;
//         }

//         const newQuote = new Quote(text, category);
//         this.quotes.push(newQuote);
//         console.log('New quote added:', newQuote);

//         newQuoteText.value = '';
//         newQuoteCategory.value = '';

//         this.showSuccess('Quote added successfully!');
//     }

//     showSuccess(message) {
//         alert(message);
//     }

//     showError(message) {
//         alert(message);
//     }
// }

// // Initialize the quote manager
// document.addEventListener('DOMContentLoaded', () => {
//     console.log('DOM loaded, initializing QuoteManager');
//     window.quoteManager = new QuoteManager();
// });

// // Export the addQuote function for the HTML button
// function addQuote() {
//     if (window.quoteManager) {
//         window.quoteManager.addQuote();
//     } else {
//         console.error('QuoteManager not initialized');
//     }
// }

// // Quote class definition
// class Quote {
//     constructor(text, author, category) {
//         this.id = Date.now() + Math.random().toString(36).substr(2, 9);
//         this.text = text;
//         this.author = author;
//         this.category = category;
//         this.createdAt = new Date().toISOString();
//     }
// }

// // QuoteManager class to handle quote operations and storage
// class QuoteManager {
//     constructor() {
//         this.quotes = this.loadFromLocalStorage() || [];
//         this.initializeEventListeners();
//         this.renderQuotes();
//     }

//     // Storage Methods
//     loadFromLocalStorage() {
//         const storedQuotes = localStorage.getItem('quotes');
//         return storedQuotes ? JSON.parse(storedQuotes) : null;
//     }

//     saveToLocalStorage() {
//         localStorage.setItem('quotes', JSON.stringify(this.quotes));
//         sessionStorage.setItem('lastModified', new Date().toISOString());
//     }

//     // Quote Management Methods
//     addQuote(text, author, category) {
//         const newQuote = new Quote(text, author, category);
//         this.quotes.push(newQuote);
//         this.saveToLocalStorage();
//         this.renderQuotes();
//     }

//     deleteQuote(id) {
//         this.quotes = this.quotes.filter(quote => quote.id !== id);
//         this.saveToLocalStorage();
//         this.renderQuotes();
//     }

//     // Import/Export Methods
//     exportQuotes() {
//         const dataStr = JSON.stringify(this.quotes, null, 2);
//         const blob = new Blob([dataStr], { type: 'application/json' });
//         const url = URL.createObjectURL(blob);

//         const link = document.createElement('a');
//         link.href = url;
//         link.download = `quotes-${new Date().toISOString().split('T')[0]}.json`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//     }

//     async importQuotes(file) {
//         try {
//             const text = await file.text();
//             const importedQuotes = JSON.parse(text);

//             if (Array.isArray(importedQuotes)) {
//                 this.quotes = [...this.quotes, ...importedQuotes];
//                 this.saveToLocalStorage();
//                 this.renderQuotes();
//                 return true;
//             }
//             return false;
//         } catch (error) {
//             console.error('Error importing quotes:', error);
//             return false;
//         }
//     }

//     // UI Methods
//     renderQuotes() {
//         const quotesContainer = document.getElementById('quotes-container');
//         quotesContainer.innerHTML = '';

//         this.quotes.forEach(quote => {
//             const quoteElement = document.createElement('div');
//             quoteElement.className = 'quote-card';
//             quoteElement.innerHTML = `
//                 <blockquote>
//                     <p>${quote.text}</p>
//                     <footer>
//                         - ${quote.author}
//                         <span class="category">${quote.category}</span>
//                     </footer>
//                 </blockquote>
//                 <button class="delete-btn" data-id="${quote.id}">Delete</button>
//             `;
//             quotesContainer.appendChild(quoteElement);
//         });
//     }

//     initializeEventListeners() {
//         // Form submission handler
//         document.getElementById('quote-form').addEventListener('submit', (e) => {
//             e.preventDefault();
//             const text = document.getElementById('quote-text').value;
//             const author = document.getElementById('quote-author').value;
//             const category = document.getElementById('quote-category').value;

//             if (text && author) {
//                 this.addQuote(text, author, category);
//                 e.target.reset();
//             }
//         });

//         // Delete button handler
//         document.getElementById('quotes-container').addEventListener('click', (e) => {
//             if (e.target.classList.contains('delete-btn')) {
//                 const id = e.target.dataset.id;
//                 this.deleteQuote(id);
//             }
//         });

//         // Export button handler
//         document.getElementById('export-btn').addEventListener('click', () => {
//             this.exportQuotes();
//         });

//         // Import file handler
//         document.getElementById('import-file').addEventListener('change', async (e) => {
//             const file = e.target.files[0];
//             if (file) {
//                 const success = await this.importQuotes(file);
//                 if (success) {
//                     alert('Quotes imported successfully!');
//                 } else {
//                     alert('Error importing quotes. Please check the file format.');
//                 }
//                 e.target.value = ''; // Reset file input
//             }
//         });
//     }
// }

// // Initialize the application
// document.addEventListener('DOMContentLoaded', () => {
//     new QuoteManager();
// });

class QuoteManager {
    constructor() {
        this.quotes = this.loadFromLocalStorage() || [];
        this.initializeEventListeners();
        this.renderQuotes();
    }

    // ... (previous storage and quote management methods remain the same) ...

    renderQuotes() {
        const quoteDisplay = document.getElementById('quoteDisplay');
        if (!quoteDisplay) return; // Guard clause in case element doesn't exist

        // Display the most recent quote
        if (this.quotes.length > 0) {
            const latestQuote = this.quotes[this.quotes.length - 1];
            quoteDisplay.innerHTML = `
                <blockquote>
                    <p>${latestQuote.text}</p>
                    <footer>
                        ${latestQuote.author || 'Unknown'}
                        <span class="category">${latestQuote.category}</span>
                    </footer>
                </blockquote>
            `;
        }
    }

    initializeEventListeners() {
        // New Quote button handler
        const newQuoteBtn = document.getElementById('newQuote');
        if (newQuoteBtn) {
            newQuoteBtn.addEventListener('click', () => {
                const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
                if (randomQuote) {
                    const quoteDisplay = document.getElementById('quoteDisplay');
                    quoteDisplay.innerHTML = `
                        <blockquote>
                            <p>${randomQuote.text}</p>
                            <footer>
                                ${randomQuote.author || 'Unknown'}
                                <span class="category">${randomQuote.category}</span>
                            </footer>
                        </blockquote>
                    `;
                }
            });
        }

        // Add Quote handler
        const addQuoteBtn = document.querySelector('button[onclick="addQuote()"]');
        if (addQuoteBtn) {
            // Remove inline onclick handler and add event listener
            addQuoteBtn.removeAttribute('onclick');
            addQuoteBtn.addEventListener('click', () => {
                const text = document.getElementById('newQuoteText')?.value;
                const category = document.getElementById('newQuoteCategory')?.value;

                if (text && category) {
                    this.addQuote(text, 'Anonymous', category);
                    document.getElementById('newQuoteText').value = '';
                    document.getElementById('newQuoteCategory').value = '';
                } else {
                    alert('Please fill in both the quote and category fields');
                }
            });
        }

        // Export button handler
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportQuotes());
        }

        // Import file handler - First add the file input if it doesn't exist
        if (!document.getElementById('import-file')) {
            const importFile = document.createElement('input');
            importFile.type = 'file';
            importFile.id = 'import-file';
            importFile.accept = '.json';
            importFile.style.display = 'none';
            document.body.appendChild(importFile);
        }

        const importFile = document.getElementById('import-file');
        if (importFile) {
            importFile.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    const success = await this.importQuotes(file);
                    if (success) {
                        alert('Quotes imported successfully!');
                    } else {
                        alert('Error importing quotes. Please check the file format.');
                    }
                    e.target.value = ''; // Reset file input
                }
            });
        }
    }
}