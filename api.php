<?php
header('Content-Type: application/json');
require 'db.php';

$result = $conn->query("SELECT * FROM stocks");
$stocks = [];

while($row = $result->fetch_assoc()) {
    $stocks[] = $row;
}

echo json_encode($stocks);
$conn->close();
?>