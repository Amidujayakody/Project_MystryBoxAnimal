<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);


$servername = "localhost";
$username = "root";
$password = "";
$dbname = "animaldb";

$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}


$sql = "SELECT name, score FROM players ORDER BY score DESC LIMIT 10";
$result = $conn->query($sql);

$leaderboard = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $leaderboard[] = $row;
    }
}

header('Content-Type: application/json'); 
echo json_encode($leaderboard);


$conn->close();
?>
