<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "animal_game_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$playerName = $_POST['username'];
$playerScore = $_POST['score'];

$stmt = $conn->prepare("INSERT INTO scores (username, score) VALUES (?, ?)");
$stmt->bind_param("si", $playerName, $playerScore);

if ($stmt->execute()) {
    
    echo "
    <div style='
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        font-family: Arial, sans-serif;
        background-color: #f9fafc;
        color: #2ecc71;
        text-align: center;
    '>
        <h1 style='font-size: 2.5rem; margin-bottom: 10px;'>🎉 Success! 🎉</h1>
        <p style='font-size: 1.2rem; margin-bottom: 20px;'>Your score has been saved successfully.</p>
        <a href='game.html' style='
            display: inline-block;
            text-decoration: none;
            padding: 12px 24px;
            font-size: 1rem;
            color: white;
            background-color: #3498db;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease;
        ' onmouseover=\"this.style.backgroundColor='#2980b9'\"
           onmouseout=\"this.style.backgroundColor='#3498db'\">
            🔙 Return to Game
        </a>
    </div>
    ";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
