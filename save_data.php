<?php

$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "animaldb"; 


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}


$player_name = $_POST['name']; 
$score = $_POST['score']; 


$player_name = $conn->real_escape_string($player_name);
$score = (int)$score; 


$sql_check = "SELECT * FROM players WHERE name = '$player_name'";
$result = $conn->query($sql_check);

if ($result->num_rows > 0) {
    
    $sql_update = "UPDATE players SET score = GREATEST(score, $score) WHERE name = '$player_name'";
    if ($conn->query($sql_update) === TRUE) {
        echo json_encode(['message' => 'Score updated successfully']);
    } else {
        echo json_encode(['error' => 'Error updating score: ' . $conn->error]);
    }
} else {
   
    $sql_insert = "INSERT INTO players (name, score) VALUES ('$player_name', $score)";
    if ($conn->query($sql_insert) === TRUE) {
        echo json_encode(['message' => 'New record created successfully']);
    } else {
        echo json_encode(['error' => 'Error inserting record: ' . $conn->error]);
    }
}


$conn->close();
?>
