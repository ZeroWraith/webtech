<?php
$host = 'localhost';
$user = 'root';
$pass = 'Aadityaisthe1'; // <-- CHANGE THIS TO YOUR MYSQL PASSWORD (e.g., 'root', 'password', or '')
$conn = new mysqli($host, $user, $pass);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database
$conn->query("CREATE DATABASE IF NOT EXISTS stock_market");
$conn->select_db('stock_market');

// Create stocks table
$table_sql = "CREATE TABLE IF NOT EXISTS stocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL,
    company VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    previous_price DECIMAL(10,2) NOT NULL
)";
$conn->query($table_sql);

// Insert initial data if empty
$result = $conn->query("SELECT COUNT(*) as cnt FROM stocks");
$row = $result->fetch_assoc();

if ($row['cnt'] == 0) {
    $insert_sql = "INSERT INTO stocks (symbol, company, price, previous_price) VALUES
    ('AAPL', 'Apple Inc.', 150.00, 150.00),
    ('GOOGL', 'Alphabet Inc.', 2800.00, 2800.00),
    ('MSFT', 'Microsoft Corp.', 300.00, 300.00),
    ('TSLA', 'Tesla Inc.', 700.00, 700.00),
    ('AMZN', 'Amazon.com Inc.', 3300.00, 3300.00),
    ('NVDA', 'NVIDIA Corp.', 450.00, 450.00)";
    $conn->query($insert_sql);
    echo "<h1>Database initialized with initial stock data!</h1>";
} else {
    echo "<h1>Database already initialized!</h1>";
}

echo "<p><a href='index.html'>Go to Dashboard</a></p>";
?>