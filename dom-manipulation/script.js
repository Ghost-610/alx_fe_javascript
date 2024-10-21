class Quote {
    constructor(text, author, category) {
        this.id = Date.now() + Math.random().toString(36).substr(2, 9);
        this.text = text;
        this.author = author || 'Anonymous'; // Default to 'Anonymous' if no author is provided
        this.category = category;
        this.createdAt = new Date().toISOString();
    }
}

class QuoteManager {
    constructor() {
        this.quotes = this.loadFromLocalStorage() || [];
        this.populateCategories();
        this.initializeEventListeners();
        this.renderQuotes();
    }

    loadFromLocalStorage() {
        const storedQuotes = localStorage.getItem('quotes');
        return storedQuotes ? JSON.parse(storedQuotes) : null;
    }

    saveToLocalStorage() {
        localStorage.setItem('quotes', JSON.stringify(this.quotes));
    }

    addQuote(text, author, category) {
        if (text && category) {
            const newQuote = new Quote(text, author, category);
            this.quotes.push(newQuote);
            this.saveToLocalStorage();
            this.renderQuotes();
            this.populateCategories(); // Update category filter dropdown
            alert('Quote added successfully!');
        } else {
            alert('Please provide both the quote text and category.');
        }
    }

    // New filterQuote method to filter quotes by text, author, or category
    filterQuote(keyword) {
        if (!keyword) return this.quotes;

        return this.quotes.filter(quote =>
            quote.text.toLowerCase().includes(keyword.toLowerCase()) ||
            quote.author.toLowerCase().includes(keyword.toLowerCase()) ||
            quote.category.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    renderQuotes(category = null, keyword = '') {
        const quoteDisplay = document.getElementById('quoteDisplay');
        if (!quoteDisplay) return;

        let filteredQuotes = this.quotes;

        // Filter by category if provided
        if (category) {
            filteredQuotes = filteredQuotes.filter(quote => quote.category === category);
        }

        // Apply the filter by keyword using the filterQuote method
        filteredQuotes = this.filterQuote(keyword);

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
            quoteDisplay.innerHTML = '<p>No quotes match your filter criteria.</p>';
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

    initializeEventListeners() {
        // Event listener for adding a new quote
        const addQuoteBtn = document.getElementById('addQuoteBtn');
        if (addQuoteBtn) {
            addQuoteBtn.addEventListener('click', () => {
                const text = document.getElementById('newQuoteText')?.value.trim();
                const author = document.getElementById('quote-author')?.value.trim();
                const category = document.getElementById('newQuoteCategory')?.value.trim();

                this.addQuote(text, author, category);

                // Clear the input fields
                document.getElementById('newQuoteText').value = '';
                document.getElementById('quote-author').value = '';
                document.getElementById('newQuoteCategory').value = '';
            });
        }

        // Event listener for category filtering
        const categorySelect = document.getElementById('categoryFilter');
        if (categorySelect) {
            categorySelect.addEventListener('change', (event) => {
                const selectedCategory = event.target.value;
                this.renderQuotes(selectedCategory);
            });
        }

        // Event listener for keyword search filtering
        const searchInput = document.getElementById('quoteSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                const keyword = event.target.value;
                this.renderQuotes(null, keyword);
            });
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.quoteManager = new QuoteManager();
});
