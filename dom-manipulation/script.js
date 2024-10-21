class Quote {
    constructor(text, author, category) {
        this.id = Date.now() + Math.random().toString(36).substr(2, 9);
        this.text = text;
        this.author = author || 'Anonymous';
        this.category = category || 'Uncategorized';
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }
}

class QuoteManager {
    constructor() {
        this.quotes = this.loadFromLocalStorage() || [];
        this.populateCategories();
        this.initializeEventListeners();
        this.renderQuotes();
    }

    // Load quotes from local storage
    loadFromLocalStorage() {
        const storedQuotes = localStorage.getItem('quotes');
        return storedQuotes ? JSON.parse(storedQuotes) : [];
    }

    // Save quotes to local storage
    saveToLocalStorage() {
        localStorage.setItem('quotes', JSON.stringify(this.quotes));
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
                        ${randomQuote.author || 'Unknown'} <span class="category">${randomQuote.category}</span>
                    </footer>
                </blockquote>
            `;
        } else {
            quoteDisplay.innerHTML = '<p>No quotes available. Add some quotes to get started!</p>';
        }
    }

    // Add a new quote
    addQuote(text, author, category) {
        if (text && category) {
            const newQuote = new Quote(text, author, category);
            this.quotes.push(newQuote);
            this.saveToLocalStorage();
            this.renderQuotes();
            this.populateCategories();
            alert('Quote added successfully!');
        } else {
            alert('Please provide both the quote text and category.');
        }
    }

    // Populate categories dropdown based on existing quotes
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

    // Initialize event listeners for buttons and inputs
    initializeEventListeners() {
        // Show New Quote Button
        const newQuoteBtn = document.getElementById('newQuote');
        newQuoteBtn.addEventListener('click', () => {
            this.renderQuotes();
        });

        // Add Quote Button
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

        // Category Filter
        const categorySelect = document.getElementById('categoryFilter');
        categorySelect.addEventListener('change', (event) => {
            const selectedCategory = event.target.value;
            this.renderQuotes(selectedCategory);
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.quoteManager = new QuoteManager();
});
