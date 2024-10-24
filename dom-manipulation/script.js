class Quote {
    constructor(text, author, category) {
        this.id = Date.now() + Math.random().toString(36).substr(2, 9);
        this.text = text;
        this.author = author || 'Anonymous';
        this.category = category || 'Uncategorized';
        this.createdAt = new Date().toISOString();
    }
}

class QuoteManager {
    constructor() {
        this.quotes = this.loadFromLocalStorage() || [];
        this.createAddQuoteForm();
        this.populateCategories();
        this.initializeEventListeners();
        this.showRandomQuote();
        this.startPeriodicFetching(); // Start periodic fetching of quotes
    }

    loadFromLocalStorage() {
        const storedQuotes = localStorage.getItem('quotes');
        return storedQuotes ? JSON.parse(storedQuotes) : [];
    }

    saveToLocalStorage() {
        localStorage.setItem('quotes', JSON.stringify(this.quotes));
    }

    addQuote(text, author, category) {
        const newQuote = new Quote(text, author, category);
        this.quotes.push(newQuote);
        this.saveToLocalStorage();
        this.showRandomQuote();
        this.populateCategories();
        this.postQuoteToServer(newQuote); // Post the new quote to the server
    }

    showRandomQuote() {
        const quoteDisplay = document.getElementById('quoteDisplay');
        if (!quoteDisplay || this.quotes.length === 0) {
            quoteDisplay.innerHTML = '<p>No quotes available. Add some quotes to get started!</p>';
            return;
        }

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
    }

    populateCategories() {
        const categories = [...new Set(this.quotes.map(quote => quote.category))];
        const categorySelect = document.getElementById('categoryFilter');

        if (categorySelect) {
            categorySelect.innerHTML = '<option value="all">All Categories</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        }
    }

    createAddQuoteForm() {
        const formContainer = document.createElement('div');

        formContainer.innerHTML = `
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="quote-author" type="text" placeholder="Enter author name" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button id="addQuoteBtn">Add Quote</button>
        `;

        document.body.appendChild(formContainer);
    }

    initializeEventListeners() {
        const newQuoteBtn = document.getElementById('newQuote');
        newQuoteBtn.addEventListener('click', () => {
            this.showRandomQuote();
        });

        const addQuoteBtn = document.getElementById('addQuoteBtn');
        addQuoteBtn.addEventListener('click', () => {
            const text = document.getElementById('newQuoteText').value.trim();
            const author = document.getElementById('quote-author').value.trim();
            const category = document.getElementById('newQuoteCategory').value.trim();

            this.addQuote(text, author, category);

            // Clear input fields
            document.getElementById('newQuoteText').value = '';
            document.getElementById('quote-author').value = '';
            document.getElementById('newQuoteCategory').value = '';
        });

        const categorySelect = document.getElementById('categoryFilter');
        categorySelect.addEventListener('change', (event) => {
            const selectedCategory = event.target.value;
            this.renderQuotes(selectedCategory);
        });

        const importBtn = document.getElementById('import-btn');
        importBtn.addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        const exportBtn = document.getElementById('export-btn');
        exportBtn.addEventListener('click', () => {
            this.exportQuotesToJson();
        });
    }

    async fetchQuotesFromServer() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
            const data = await response.json();
            const fetchedQuotes = data.map(item => new Quote(item.body, item.title, 'Fetched Category'));

            // Update local quotes and handle conflicts
            fetchedQuotes.forEach(fetchedQuote => {
                const existingQuoteIndex = this.quotes.findIndex(quote => quote.text === fetchedQuote.text && quote.author === fetchedQuote.author);
                if (existingQuoteIndex !== -1) {
                    // Conflict detected: overwrite the existing quote with the fetched one
                    this.quotes[existingQuoteIndex] = fetchedQuote;
                } else {
                    // If the quote doesn't exist locally, add it
                    this.quotes.push(fetchedQuote);
                }
            });

            this.saveToLocalStorage();
            this.populateCategories();
            this.showRandomQuote();
        } catch (error) {
            console.error('Error fetching quotes:', error);
        }
    }

    async postQuoteToServer(quote) {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: quote.author, // Using the author as title for the mock API
                    body: quote.text, // Using the quote text as body
                    category: quote.category, // You can customize this as per your requirement
                }),
            });
            const result = await response.json();
            console.log('Quote posted to server:', result);
        } catch (error) {
            console.error('Error posting quote:', error);
        }
    }

    startPeriodicFetching() {
        setInterval(() => {
            this.fetchQuotesFromServer(); // Fetch new quotes every 10 seconds
        }, 10000);
    }

    importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            try {
                const importedQuotes = JSON.parse(e.target.result);
                this.quotes.push(...importedQuotes);
                this.saveToLocalStorage();
                alert('Quotes imported successfully!');
                this.populateCategories();
                this.showRandomQuote();
            } catch (error) {
                alert('Failed to import quotes. Please ensure the file format is correct.');
            }
        };
        fileReader.readAsText(event.target.files[0]);
    }

    exportQuotesToJson() {
        const dataStr = JSON.stringify(this.quotes, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.quoteManager = new QuoteManager();
});
