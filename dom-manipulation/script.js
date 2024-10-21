class Quote {
    constructor(text, author, category) {
        this.id = Date.now() + Math.random().toString(36).substr(2, 9);
        this.text = text;
        this.author = author || 'Anonymous'; // Default to 'Anonymous' if no author is provided
        this.category = category;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString(); // Track last update
    }
}

class QuoteManager {
    constructor() {
        this.quotes = this.loadFromLocalStorage() || [];
        this.populateCategories();
        this.initializeEventListeners();
        this.renderQuotes();
        this.syncWithServer(); // Initial sync with server
        this.periodicSync(); // Start periodic syncing
    }

    // Load quotes from local storage
    loadFromLocalStorage() {
        const storedQuotes = localStorage.getItem('quotes');
        return storedQuotes ? JSON.parse(storedQuotes) : null;
    }

    // Save quotes to local storage
    saveToLocalStorage() {
        localStorage.setItem('quotes', JSON.stringify(this.quotes));
    }

    // Fetch quotes from the server
    async fetchQuotesFromServer() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            const serverQuotes = await response.json();

            // Simulate server quote structure
            return serverQuotes.slice(0, 10).map(post => ({
                id: post.id.toString(),
                text: post.title,
                author: 'Server Author', // Placeholder
                category: 'Server Category', // Placeholder
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }));
        } catch (error) {
            console.error('Error fetching quotes from server:', error);
            return [];
        }
    }

    // Sync quotes with the server, using server data as the source of truth
    async syncWithServer() {
        const serverQuotes = await this.fetchQuotesFromServer();
        this.quotes = this.resolveConflicts(this.quotes, serverQuotes);
        this.saveToLocalStorage();
        this.renderQuotes();
    }

    // Periodic syncing every 30 seconds
    periodicSync() {
        setInterval(() => {
            console.log('Syncing with server...');
            this.syncWithServer();
        }, 30000); // Sync every 30 seconds
    }

    // Resolve conflicts between local and server quotes, giving priority to server data
    resolveConflicts(localQuotes, serverQuotes) {
        const mergedQuotes = [];

        // Create a map of server quotes by ID for quick comparison
        const serverQuoteMap = new Map(serverQuotes.map(quote => [quote.id, quote]));

        // Iterate over local quotes to merge
        localQuotes.forEach(localQuote => {
            const serverQuote = serverQuoteMap.get(localQuote.id);

            if (serverQuote) {
                // Conflict exists, choose the server version
                mergedQuotes.push(serverQuote);
            } else {
                // If the quote doesn't exist on the server, keep the local version
                mergedQuotes.push(localQuote);
            }
        });

        // Add any new server quotes not present locally
        serverQuotes.forEach(serverQuote => {
            if (!localQuotes.some(quote => quote.id === serverQuote.id)) {
                mergedQuotes.push(serverQuote);
            }
        });

        return mergedQuotes;
    }

    // Add a new quote
    async addQuote(text, author, category) {
        if (text && category) {
            const newQuote = new Quote(text, author, category);
            this.quotes.push(newQuote);
            this.saveToLocalStorage();
            this.renderQuotes();
            this.populateCategories(); // Update category filter dropdown

            try {
                // Simulate posting the new quote to the server
                const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: newQuote.text,
                        body: newQuote.author, // Simulating author as body
                        userId: 1,
                    }),
                });
                const serverData = await response.json();
                console.log('Quote synced with server:', serverData);

                alert('Quote added and synced with server successfully!');
            } catch (error) {
                alert('Quote added locally, but failed to sync with server.');
            }
        } else {
            alert('Please provide both the quote text and category.');
        }
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

    // Populate category dropdown based on available quotes
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

    // Initialize event listeners
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
