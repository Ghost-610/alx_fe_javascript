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
        this.createAddQuoteForm(); // Call to create the form for adding quotes
        this.populateCategories();
        this.initializeEventListeners();
        this.showRandomQuote(); // Show a random quote on initialization
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
        this.showRandomQuote(); // Show random quote after adding a new one
        this.populateCategories();
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
            categorySelect.innerHTML = '<option value="">All Categories</option>';
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
            this.showRandomQuote(); // Call showRandomQuote on button click
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

        // Import button functionality
        const importBtn = document.getElementById('import-btn');
        importBtn.addEventListener('click', () => {
            document.getElementById('importFile').click(); // Trigger the file input click
        });
    }

    // Import quotes from a JSON file
    importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            try {
                const importedQuotes = JSON.parse(e.target.result);
                this.quotes.push(...importedQuotes);
                this.saveToLocalStorage();
                alert('Quotes imported successfully!');
                this.populateCategories();
                this.showRandomQuote(); // Show a random quote after import
            } catch (error) {
                alert('Failed to import quotes. Please ensure the file format is correct.');
            }
        };
        fileReader.readAsText(event.target.files[0]);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.quoteManager = new QuoteManager();
});
