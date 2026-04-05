# Live Stock Market Dashboard

A lightweight, purely native Live Stock Market Dashboard built with HTML, CSS, JavaScript, PHP, and MySQL. This project does not rely on any external libraries, frameworks, or dependencies—it utilizes native Web APIs to mimic a real-time polling data dashboard.

## 🚀 Features

- **Live Polling:** The Javascript frontend automatically polls the PHP backend every 3 seconds to fetch the latest stock data without refreshing the page.
- **Dynamic Simulation:** A backend PHP script periodically updates stock values inside the MySQL database to simulate a live moving market (prices fluctuate up and down randomly).
- **Responsive UI:** A clean, dark-mode CSS Grid layout visually displays prices.
- **Visual Status Indicators:** Cards dynamically turn green when a stock rises and red when a stock falls, complete with arrow indicators.
- **Interactive Stock Graphs:** Click on any stock card to view a graph of its price trends.
- **Zero Dependencies:** Written entirely in Vanilla JS, Raw CSS, and native PHP `mysqli`.

## 📂 Project Structure

```text
├── api.php       # Fetches the latest stock data from the database and serves it as JSON.
├── db.php        # Handles the MySQL database connection credentials.
├── index.html    # The main UI structure where the stock dashboard is displayed.
├── script.js     # Handles async API polling and dynamic DOM updates.
├── setup.php     # Automatically creates the database, tables, and inserts initial stock data.
├── simulate.php  # Simulates market movements by randomly increasing/decreasing prices in the DB.
└── style.css     # The dashboard's stylesheet.
```

## 🛠 Prerequisites

To run this project locally, you need a server environment capable of running PHP and MySQL:
- [XAMPP](https://www.apachefriends.org/index.html) (Windows/Mac/Linux)
- [MAMP](https://www.mamp.info/) (Mac)
- Or a standard LAMP/LEMP stack on Linux.

## ⚙️ Installation & Setup

1. **Clone or Download the Repository:**
   Place the project files into your local web server's document root (e.g., `htdocs/` for XAMPP or `/var/www/html/` for Linux Apache).

2. **Configure Database Credentials:**
   Open `setup.php` and `db.php` and ensure your database credentials match your local MySQL server.
   ```php
   $host = 'localhost';
   $user = 'root';
   $pass = 'your_mysql_password'; // Update if your DB has a specific password
   ```

3. **Start your Servers:**
   Ensure both your local Apache/PHP server and MySQL database server are actively running.

   *(Optional)* If you don't use Apache/Nginx, you can run PHP's built-in development server from the terminal inside this folder:
   ```bash
   php -S localhost:8000
   ```

4. **Initialize the Database:**
   Before viewing the dashboard, open your browser and run the setup script to generate the database, table, and dummy data:
   - Go to: `http://localhost/webtech/setup.php` (Adjust the path based on your folder name or port, e.g., `http://localhost:8000/setup.php`).

5. **View the Dashboard:**
   Finally, open `index.html` in your browser:
   - Go to: `http://localhost/webtech/index.html` (or `http://localhost:8000/index.html`).

## 🧠 How it Works

1. `script.js` starts a `setInterval` loop that runs every 3 seconds.
2. In each tick, the JS script pings `simulate.php` to slightly modify the stock prices stored in MySQL.
3. Immediately after, JS calls `api.php`.
4. `api.php` returns the new prices and previous prices in a JSON format.
5. JavaScript calculates the percentage change and difference. It conditionally formats the DOM elements (color-coding green for positive or red for negative change).