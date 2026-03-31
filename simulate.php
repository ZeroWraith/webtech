<?php
// This script simulates market activity by slightly modifying stock prices
require 'db.php';

$result = $conn->query("SELECT id, price FROM stocks");

while($row = $result->fetch_assoc()) {
    $id = $row['id'];
    $current_price = $row['price'];
    
    // Random fluctuation between -2% and +2%
    $change_percent = (rand(-200, 200) / 10000); 
    $new_price = $current_price + ($current_price * $change_percent);
    
    // Ensure price doesn't drop below 1
    if ($new_price < 1) $new_price = 1;

    $new_price = round($new_price, 2);

    $stmt = $conn->prepare("UPDATE stocks SET previous_price = ?, price = ? WHERE id = ?");
    $stmt->bind_param("ddi", $current_price, $new_price, $id);
    $stmt->execute();
}

echo "Prices simulated and updated.";
$conn->close();
?>