// Standalone fetch function for testing
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        const data = await response.json();
        return data.map(item => ({
            text: item.body,
            author: item.title,
            category: 'Fetched Category'
        }));
    } catch (error) {
        console.error('Error fetching quotes:', error);
        return [];
    }
}

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
        this.populateCategories();
        this.initializeEventListeners();
        this.showRandomQuote();
        this.startPeriodicFetching();
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
        this.postQuoteToServer(newQuote);
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

    initializeEventListeners() {
        const newQuoteBtn = document.getElementById('newQuote');
        if (newQuoteBtn) {
            newQuoteBtn.addEventListener('click', () => {
                this.showRandomQuote();
            });
        }

        const addQuoteBtn = document.getElementById('addQuoteBtn');
        if (addQuoteBtn) {
            addQuoteBtn.addEventListener('click', () => {
                const text = document.getElementById('newQuoteText').value.trim();
                const author = document.getElementById('quote-author').value.trim();
                const category = document.getElementById('newQuoteCategory').value.trim();

                if (text) {
                    this.addQuote(text, author, category);

                    // Clear input fields
                    document.getElementById('newQuoteText').value = '';
                    document.getElementById('quote-author').value = '';
                    document.getElementById('newQuoteCategory').value = '';
                }
            });
        }

        const categorySelect = document.getElementById('categoryFilter');
        if (categorySelect) {
            categorySelect.addEventListener('change', (event) => {
                const selectedCategory = event.target.value;
                this.filterQuotes(selectedCategory);
            });
        }

        const importBtn = document.getElementById('import-btn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                const importFile = document.getElementById('importFile');
                if (importFile) {
                    importFile.click();
                }
            });
        }

        const importFile = document.getElementById('importFile');
        if (importFile) {
            importFile.addEventListener('change', (event) => {
                this.importFromJsonFile(event);
            });
        }

        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportQuotesToJson();
            });
        }
    }

    filterQuotes(category) {
        if (category === 'all') {
            this.showRandomQuote();
            return;
        }

        const filteredQuotes = this.quotes.filter(quote => quote.category === category);
        const quoteDisplay = document.getElementById('quoteDisplay');
        
        if (filteredQuotes.length === 0) {
            quoteDisplay.innerHTML = '<p>No quotes found in this category.</p>';
            return;
        }

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
    }

    async fetchQuotesFromServer() {
        try {
            const fetchedQuotesData = await fetchQuotesFromServer(); // Using the standalone function
            const fetchedQuotes = fetchedQuotesData.map(item => 
                new Quote(item.text, item.author, item.category)
            );

            // Update local quotes and handle conflicts
            fetchedQuotes.forEach(fetchedQuote => {
                const existingQuoteIndex = this.quotes.findIndex(quote => 
                    quote.text === fetchedQuote.text && quote.author === fetchedQuote.author
                );
                if (existingQuoteIndex !== -1) {
                    this.quotes[existingQuoteIndex] = fetchedQuote;
                } else {
                    this.quotes.push(fetchedQuote);
                }
            });

            this.saveToLocalStorage();
            this.populateCategories();
            this.showRandomQuote();

            // Update fetch status
            const fetchStatus = document.getElementById('fetchStatus');
            if (fetchStatus) {
                fetchStatus.textContent = `Last fetched: ${new Date().toLocaleTimeString()}`;
            }
        } catch (error) {
            console.error('Error fetching quotes:', error);
            const fetchStatus = document.getElementById('fetchStatus');
            if (fetchStatus) {
                fetchStatus.textContent = `Error fetching quotes: ${error.message}`;
            }
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
                    title: quote.author,
                    body: quote.text,
                    category: quote.category,
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
            this.fetchQuotesFromServer();
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