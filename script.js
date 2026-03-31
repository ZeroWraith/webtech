async function fetchStocks() {
    try {
        // 1. Trigger the PHP script to simulate market movement in the DB
        // (In a real application, this would be updated by real market feeds, 
        // but since we want to demonstrate live changes, we trigger it here)
        await fetch('simulate.php');

        // 2. Fetch the latest stock data directly from the DB
        const response = await fetch('api.php');
        const stocks = await response.json();
        
        // 3. Render the data to the DOM
        renderStocks(stocks);
    } catch (error) {
        console.error("Error fetching stocks:", error);
        document.getElementById('stock-container').innerHTML = 
            "<p style='color:red;'>Failed to load market data. Make sure PHP and MySQL are running and setup.php has been executed.</p>";
    }
}

function renderStocks(stocks) {
    const container = document.getElementById('stock-container');
    container.innerHTML = ''; // Clear current

    stocks.forEach(stock => {
        const price = parseFloat(stock.price);
        const prevPrice = parseFloat(stock.previous_price);
        const diff = price - prevPrice;
        const percentChange = ((diff / prevPrice) * 100).toFixed(2);
        
        let colorClass = 'neutral';
        let indicator = '';

        if (diff > 0) {
            colorClass = 'up';
            indicator = '▲';
        } else if (diff < 0) {
            colorClass = 'down';
            indicator = '▼';
        } else {
            indicator = '▬';
        }

        const card = document.createElement('div');
        card.className = `card ${colorClass}`;
        card.innerHTML = `
            <div class="symbol">${stock.symbol}</div>
            <div class="company">${stock.company}</div>
            <div class="price">$${price.toFixed(2)}</div>
            <div class="change">${indicator} $${Math.abs(diff).toFixed(2)} (${Math.abs(percentChange)}%)</div>
        `;
        
        container.appendChild(card);
    });
}

// Initial fetch immediately
fetchStocks();

// Poll the server every 3 seconds for new prices
setInterval(fetchStocks, 3000);