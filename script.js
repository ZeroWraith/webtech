let stockHistory = {};
let stockChartInstance = null;
let activeStockSymbol = null;

// Modal elements
const modal = document.getElementById('stock-modal');
const closeBtn = document.querySelector('.close-btn');
const modalSymbol = document.getElementById('modal-symbol');
const modalCompany = document.getElementById('modal-company');
const modalPrice = document.getElementById('modal-price');
const modalChange = document.getElementById('modal-change');
const ctx = document.getElementById('stockChart').getContext('2d');

closeBtn.onclick = function() {
    modal.style.display = "none";
    activeStockSymbol = null;
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        activeStockSymbol = null;
    }
}

async function fetchStocks() {
    try {
        await fetch('simulate.php');
        const response = await fetch('api.php');
        const stocks = await response.json();
        renderStocks(stocks);
    } catch (error) {
        console.error("Error fetching stocks:", error);
        document.getElementById('stock-container').innerHTML = 
            "<p style='color:red;'>Failed to load market data. Make sure PHP and MySQL are running and setup.php has been executed.</p>";
    }
}

function renderStocks(stocks) {
    const container = document.getElementById('stock-container');
    container.innerHTML = ''; 
    const now = new Date().toLocaleTimeString();

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

        // Initialize history
        if (!stockHistory[stock.symbol]) {
            stockHistory[stock.symbol] = {
                labels: [],
                data: []
            };
        }
        
        // Push current price to history
        stockHistory[stock.symbol].labels.push(now);
        stockHistory[stock.symbol].data.push(price);
        
        // Keep only last 20 data points
        if (stockHistory[stock.symbol].labels.length > 20) {
            stockHistory[stock.symbol].labels.shift();
            stockHistory[stock.symbol].data.shift();
        }

        const card = document.createElement('div');
        card.className = `card ${colorClass}`;
        card.innerHTML = `
            <div class="symbol">${stock.symbol}</div>
            <div class="company">${stock.company}</div>
            <div class="price">$${price.toFixed(2)}</div>
            <div class="change">${indicator} $${Math.abs(diff).toFixed(2)} (${Math.abs(percentChange)}%)</div>
        `;
        
        card.onclick = () => openModal(stock, diff, percentChange, indicator, colorClass);
        container.appendChild(card);

        // Update modal info and chart if this stock is active
        if (activeStockSymbol === stock.symbol) {
            updateModalInfo(stock, diff, percentChange, indicator, colorClass);
            updateChart();
        }
    });
}

function openModal(stock, diff, percentChange, indicator, colorClass) {
    activeStockSymbol = stock.symbol;
    updateModalInfo(stock, diff, percentChange, indicator, colorClass);
    initChart(stock.symbol);
    modal.style.display = "block";
}

function updateModalInfo(stock, diff, percentChange, indicator, colorClass) {
    modalSymbol.textContent = stock.symbol;
    modalCompany.textContent = stock.company;
    const price = parseFloat(stock.price).toFixed(2);
    modalPrice.textContent = `$${price}`;
    modalChange.textContent = `${indicator} $${Math.abs(diff).toFixed(2)} (${Math.abs(percentChange)}%)`;
    
    modalPrice.className = colorClass === 'up' ? 'price-up' : (colorClass === 'down' ? 'price-down' : '');
    modalChange.className = colorClass === 'up' ? 'price-up' : (colorClass === 'down' ? 'price-down' : '');
}

function initChart(symbol) {
    if (stockChartInstance) {
        stockChartInstance.destroy();
    }
    
    const history = stockHistory[symbol];
    stockChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: history.labels,
            datasets: [{
                label: `${symbol} Price`,
                data: history.data,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0 // Disable animation for live update feel
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function updateChart() {
    if (stockChartInstance && activeStockSymbol) {
        const history = stockHistory[activeStockSymbol];
        stockChartInstance.data.labels = history.labels;
        stockChartInstance.data.datasets[0].data = history.data;
        
        // Change color based on trend
        const datasets = stockChartInstance.data.datasets[0];
        if (history.data.length >= 2) {
            const last = history.data[history.data.length - 1];
            const prev = history.data[history.data.length - 2];
            datasets.borderColor = last >= prev ? '#4CAF50' : '#F44336';
            datasets.backgroundColor = last >= prev ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)';
        }
        
        stockChartInstance.update();
    }
}

fetchStocks();
setInterval(fetchStocks, 3000);
