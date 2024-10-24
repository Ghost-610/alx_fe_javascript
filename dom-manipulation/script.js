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
        this.initializeEventListeners();
        this.renderQuotes();
        this.populateCategories();
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
        this.renderQuotes();
        this.populateCategories();
    }

    // Render quotes to the page
    renderQuotes(category = null) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        if (!quoteDisplay) return;

        const filteredQuotes = category
            ? this.quotes.filter(quote => quote.category === category)
            : this.quotes;

        if (filteredQuotes.length > 0) {
            const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
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

    // Display a random quote from all available quotes
    showRandomQuote() {
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

    // Function to create the form dynamically for adding quotes
    createAddQuoteForm() {
        const formContainer = document.createElement('div');

        formContainer.innerHTML = `
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="quote-author" type="text" placeholder="Enter quote author" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button id="addQuoteBtn">Add Quote</button>
        `;

        document.body.appendChild(formContainer);
    }

    initializeEventListeners() {
        const addQuoteBtn = document.getElementById('addQuoteBtn');
        if (addQuoteBtn) {
            addQuoteBtn.addEventListener('click', () => {
                const text = document.getElementById('newQuoteText').value.trim();
                const author = document.getElementById('quote-author').value.trim();
                const category = document.getElementById('newQuoteCategory').value.trim();

                if (text && category) {
                    this.addQuote(text, author, category);

                    // Clear input fields after adding the quote
                    document.getElementById('newQuoteText').value = '';
                    document.getElementById('quote-author').value = '';
                    document.getElementById('newQuoteCategory').value = '';
                } else {
                    alert('Please fill in both the quote and category fields');
                }
            });
        }

        const categorySelect = document.getElementById('categoryFilter');
        if (categorySelect) {
            categorySelect.addEventListener('change', (event) => {
                const selectedCategory = event.target.value;
                this.renderQuotes(selectedCategory);
            });
        }

        const newQuoteBtn = document.getElementById('newQuote');
        if (newQuoteBtn) {
            newQuoteBtn.addEventListener('click', () => this.showRandomQuote()); // Bind to showRandomQuote function
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.quoteManager = new QuoteManager();
});
