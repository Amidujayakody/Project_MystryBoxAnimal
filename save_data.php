<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "animaldb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

if (!isset($_POST['name'], $_POST['score'], $_POST['password'])) {
    die(json_encode(['error' => 'Missing required fields']));
}

$player_name = $conn->real_escape_string($_POST['name']);
$score = (int) $_POST['score'];
$player_password = $conn->real_escape_string($_POST['password']);

// Check if the player already exists
$sql_check = "SELECT * FROM players WHERE name = '$player_name' AND password = '$player_password'";
$result = $conn->query($sql_check);

if ($result->num_rows > 0) {
    // Update the score if the player exists
    $sql_update = "UPDATE players SET score = GREATEST(score, $score) WHERE name = '$player_name' AND password = '$player_password'";
    if ($conn->query($sql_update) === TRUE) {
        echo json_encode(['message' => 'Score updated successfully']);
    } else {
        die(json_encode(['error' => 'Error updating score: ' . $conn->error]));
    }
} else {
    // Insert new player data
    $sql_insert = "INSERT INTO players (name, score, password) VALUES ('$player_name', $score, '$player_password')";
    if ($conn->query($sql_insert) === TRUE) {
        echo json_encode(['message' => 'New record created successfully']);
    } else {
        die(json_encode(['error' => 'Error inserting record: ' . $conn->error]));
    }
}

$conn->close();
?>
