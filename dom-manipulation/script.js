// class QuoteManager {
//     constructor() {
//         this.quotes = this.loadFromLocalStorage() || [];
//         this.initializeEventListeners();
//         this.renderQuotes();
//     }

//     // ... (previous storage and quote management methods remain the same) ...

//     renderQuotes() {
//         const quoteDisplay = document.getElementById('quoteDisplay');
//         if (!quoteDisplay) return; // Guard clause in case element doesn't exist

//         // Display the most recent quote
//         if (this.quotes.length > 0) {
//             const latestQuote = this.quotes[this.quotes.length - 1];
//             quoteDisplay.innerHTML = `
//                 <blockquote>
//                     <p>${latestQuote.text}</p>
//                     <footer>
//                         ${latestQuote.author || 'Unknown'}
//                         <span class="category">${latestQuote.category}</span>
//                     </footer>
//                 </blockquote>
//             `;
//         }
//     }

//     initializeEventListeners() {
//         // New Quote button handler
//         const newQuoteBtn = document.getElementById('newQuote');
//         if (newQuoteBtn) {
//             newQuoteBtn.addEventListener('click', () => {
//                 const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
//                 if (randomQuote) {
//                     const quoteDisplay = document.getElementById('quoteDisplay');
//                     quoteDisplay.innerHTML = `
//                         <blockquote>
//                             <p>${randomQuote.text}</p>
//                             <footer>
//                                 ${randomQuote.author || 'Unknown'}
//                                 <span class="category">${randomQuote.category}</span>
//                             </footer>
//                         </blockquote>
//                     `;
//                 }
//             });
//         }

//         // Add Quote handler
//         const addQuoteBtn = document.querySelector('button[onclick="addQuote()"]');
//         if (addQuoteBtn) {
//             // Remove inline onclick handler and add event listener
//             addQuoteBtn.removeAttribute('onclick');
//             addQuoteBtn.addEventListener('click', () => {
//                 const text = document.getElementById('newQuoteText')?.value;
//                 const category = document.getElementById('newQuoteCategory')?.value;

//                 if (text && category) {
//                     this.addQuote(text, 'Anonymous', category);
//                     document.getElementById('newQuoteText').value = '';
//                     document.getElementById('newQuoteCategory').value = '';
//                 } else {
//                     alert('Please fill in both the quote and category fields');
//                 }
//             });
//         }

//         // Export button handler
//         const exportBtn = document.getElementById('export-btn');
//         if (exportBtn) {
//             exportBtn.addEventListener('click', () => this.exportQuotes());
//         }

//         // Import file handler - First add the file input if it doesn't exist
//         if (!document.getElementById('import-file')) {
//             const importFile = document.createElement('input');
//             importFile.type = 'file';
//             importFile.id = 'import-file';
//             importFile.accept = '.json';
//             importFile.style.display = 'none';
//             document.body.appendChild(importFile);
//         }

//         const importFile = document.getElementById('import-file');
//         if (importFile) {
//             importFile.addEventListener('change', async (e) => {
//                 const file = e.target.files[0];
//                 if (file) {
//                     const success = await this.importQuotes(file);
//                     if (success) {
//                         alert('Quotes imported successfully!');
//                     } else {
//                         alert('Error importing quotes. Please check the file format.');
//                     }
//                     e.target.value = ''; // Reset file input
//                 }
//             });
//         }
//     }
// }

class Quote {
    constructor(text, author, category) {
        this.id = Date.now() + Math.random().toString(36).substr(2, 9);
        this.text = text;
        this.author = author;
        this.category = category;
        this.createdAt = new Date().toISOString();
    }
}

class QuoteManager {
    constructor() {
        this.quotes = this.loadFromLocalStorage() || [];
        this.initializeEventListeners();
        this.renderQuotes();
    }

    loadFromLocalStorage() {
        const storedQuotes = localStorage.getItem('quotes');
        return storedQuotes ? JSON.parse(storedQuotes) : null;
    }

    saveToLocalStorage() {
        localStorage.setItem('quotes', JSON.stringify(this.quotes));
        sessionStorage.setItem('lastModified', new Date().toISOString());
    }

    addQuote(text, author, category) {
        const newQuote = new Quote(text, author, category);
        this.quotes.push(newQuote);
        this.saveToLocalStorage();
        this.renderQuotes();
    }

    deleteQuote(id) {
        this.quotes = this.quotes.filter(quote => quote.id !== id);
        this.saveToLocalStorage();
        this.renderQuotes();
    }

    exportQuotes() {
        const dataStr = JSON.stringify(this.quotes, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `quotes-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    importQuotes(file) {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const importedQuotes = JSON.parse(event.target.result);

                if (Array.isArray(importedQuotes)) {
                    // Validate each imported quote has required fields
                    const validQuotes = importedQuotes.filter(quote =>
                        quote &&
                        typeof quote === 'object' &&
                        'text' in quote &&
                        'category' in quote
                    );

                    if (validQuotes.length > 0) {
                        this.quotes = [...this.quotes, ...validQuotes];
                        this.saveToLocalStorage();
                        this.renderQuotes();
                        alert(`Successfully imported ${validQuotes.length} quotes!`);
                    } else {
                        alert('No valid quotes found in the imported file.');
                    }
                } else {
                    alert('Invalid file format. Please import a valid JSON array of quotes.');
                }
            } catch (error) {
                console.error('Error importing quotes:', error);
                alert('Error importing quotes. Please check the file format.');
            }
        };

        reader.onerror = () => {
            console.error('Error reading file:', reader.error);
            alert('Error reading file. Please try again.');
        };

        reader.readAsText(file);
    }

    renderQuotes() {
        const quoteDisplay = document.getElementById('quoteDisplay');
        if (!quoteDisplay) return;

        if (this.quotes.length > 0) {
            const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
            quoteDisplay.innerHTML = `
                <blockquote>
                    <p>${randomQuote.text}</p>
                    <footer>
                        ${randomQuote.author || 'Unknown'}
                        <span class="category">${randomQuote.category}</span>
                    </footer>
                </blockquote>
            `;
        } else {
            quoteDisplay.innerHTML = '<p>No quotes available. Add some quotes to get started!</p>';
        }
    }

    initializeEventListeners() {
        // New Quote button handler
        const newQuoteBtn = document.getElementById('newQuote');
        if (newQuoteBtn) {
            newQuoteBtn.addEventListener('click', () => this.renderQuotes());
        }

        // Add Quote handler
        const addQuoteBtn = document.querySelector('button[onclick="addQuote()"]');
        if (addQuoteBtn) {
            addQuoteBtn.removeAttribute('onclick');
            addQuoteBtn.addEventListener('click', () => {
                const text = document.getElementById('newQuoteText')?.value;
                const author = document.getElementById('quote-author')?.value || 'Anonymous';
                const category = document.getElementById('newQuoteCategory')?.value;

                if (text && category) {
                    this.addQuote(text, author, category);
                    document.getElementById('newQuoteText').value = '';
                    document.getElementById('quote-author').value = '';
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

        // Import button and file input handlers
        const importBtn = document.getElementById('import-btn');
        const importFile = document.getElementById('import-file');

        if (importBtn && importFile) {
            importBtn.addEventListener('click', () => importFile.click());

            importFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    if (file.type === 'application/json' || file.name.endsWith('.json')) {
                        this.importQuotes(file);
                    } else {
                        alert('Please select a JSON file.');
                    }
                    e.target.value = ''; // Reset file input
                }
            });
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.quoteManager = new QuoteManager();
});