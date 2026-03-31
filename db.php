<?php
$host = 'localhost';
$user = 'root'; // Change if your MySQL user is different
$pass = 'Aadityaisthe1'; // <-- CHANGE THIS TO YOUR MYSQL PASSWORD (e.g., 'root', 'password', or '')
$dbname = 'stock_market';

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>