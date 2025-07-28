<?php

// Database Handler which establishes a connection to our database

$host = 'localhost';
$dbname = 'flashcards';
$dbusername = "root";
$dbpassword = "";   // This may be "root" instead of an empty string for MAC users

try {
    // Instantiating a new database object based on our db connection (alternative to how we've done it before)
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $dbusername, $dbpassword);

    // We're basically saying if there is an error, we want to throw an exception which is used in our catch block
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) { // This is a PDOException type which will be referenced as $e in the code block
    echo "Connection failed: " . $e->getMessage(); // Displaying the error message associated with the exception
}