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
        this.initializeEventListeners();
        this.renderQuotes(); // Show a random quote on initialization
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

    showRandomQuote() {
        this.renderQuotes(); // Simply call renderQuotes to show a random quote
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
            newQuoteBtn.addEventListener('click', () => this.showRandomQuote()); // Call showRandomQuote to show a new quote
        }

        const importBtn = document.getElementById('import-btn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                document.getElementById('importFile').click(); // Trigger the file input click
            });
        }

        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportQuotes(); // Call export function
            });
        }
    }

    importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
            const importedQuotes = JSON.parse(event.target.result);
            this.quotes.push(...importedQuotes);
            this.saveToLocalStorage();
            this.renderQuotes();
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }

    exportQuotes() {
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

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.quoteManager = new QuoteManager();
    document.getElementById('importFile').addEventListener('change', (event) => {
        quoteManager.importFromJsonFile(event);
    });
});
