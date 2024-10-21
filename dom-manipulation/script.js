class QuoteManager {
    constructor() {
        this.quotes = this.loadFromLocalStorage() || [];
        this.syncWithServer();
        this.populateCategories();
        this.initializeEventListeners();
        this.renderQuotes();
    }

    async syncWithServer() {
        try {
            const response = await fetch('https://example.com/api/quotes');
            const serverQuotes = await response.json();
            
            // Merge local and server data, resolving conflicts
            this.quotes = this.resolveConflicts(this.quotes, serverQuotes);
            this.saveToLocalStorage();
            this.renderQuotes();
        } catch (error) {
            console.error('Error syncing with server:', error);
        }
    }

    resolveConflicts(localQuotes, serverQuotes) {
        const mergedQuotes = [];

        // Create a map of server quotes by ID for easy lookup
        const serverQuoteMap = new Map(serverQuotes.map(quote => [quote.id, quote]));

        localQuotes.forEach(localQuote => {
            const serverQuote = serverQuoteMap.get(localQuote.id);

            if (serverQuote) {
                // Conflict detected: Both local and server quotes exist
                if (new Date(localQuote.updatedAt) > new Date(serverQuote.updatedAt)) {
                    // Local is newer, keep local
                    mergedQuotes.push(localQuote);
                } else {
                    // Server is newer, keep server
                    mergedQuotes.push(serverQuote);
                }
            } else {
                // No conflict, keep local quote
                mergedQuotes.push(localQuote);
            }
        });

        // Add quotes that are only present on the server
        serverQuotes.forEach(serverQuote => {
            if (!localQuotes.some(quote => quote.id === serverQuote.id)) {
                mergedQuotes.push(serverQuote);
            }
        });

        return mergedQuotes;
    }

    loadFromLocalStorage() {
        const storedQuotes = localStorage.getItem('quotes');
        return storedQuotes ? JSON.parse(storedQuotes) : null;
    }

    saveToLocalStorage() {
        localStorage.setItem('quotes', JSON.stringify(this.quotes));
    }

    async addQuote(text, author, category) {
        if (text && category) {
            const newQuote = new Quote(text, author, category);
            this.quotes.push(newQuote);
            this.saveToLocalStorage();
            this.renderQuotes();
            this.populateCategories(); // Update category filter dropdown
            
            try {
                // Sync new quote with server
                await fetch('https://example.com/api/quotes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newQuote),
                });
                alert('Quote added and synced with server successfully!');
            } catch (error) {
                alert('Quote added locally, but failed to sync with server.');
            }
        } else {
            alert('Please provide both the quote text and category.');
        }
    }

    async updateQuote(quote) {
        const existingQuoteIndex = this.quotes.findIndex(q => q.id === quote.id);
        if (existingQuoteIndex !== -1) {
            this.quotes[existingQuoteIndex] = quote;
            this.saveToLocalStorage();
            this.renderQuotes();
            
            try {
                // Sync updated quote with server
                await fetch(`https://example.com/api/quotes/${quote.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(quote),
                });
                alert('Quote updated and synced with server successfully!');
            } catch (error) {
                alert('Quote updated locally, but failed to sync with server.');
            }
        }
    }

    async deleteQuote(quoteId) {
        this.quotes = this.quotes.filter(quote => quote.id !== quoteId);
        this.saveToLocalStorage();
        this.renderQuotes();
        
        try {
            // Sync quote deletion with server
            await fetch(`https://example.com/api/quotes/${quoteId}`, {
                method: 'DELETE',
            });
            alert('Quote deleted and synced with server successfully!');
        } catch (error) {
            alert('Quote deleted locally, but failed to sync with server.');
        }
    }

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
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.quoteManager = new QuoteManager();
});
