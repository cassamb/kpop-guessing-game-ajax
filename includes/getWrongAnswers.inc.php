<?php

require_once "dbh.inc.php";

if (isset($_GET["id"])) {

    // Preparing and executing the query
    $query = $pdo->prepare("SELECT name FROM groups WHERE id != " . $_GET["id"] . ";");
    $query->execute();

    // Fetching the data as an associative array
    $results = $query->fetchAll(PDO::FETCH_ASSOC);

    // Converting result/server response to JSON format
    echo json_encode($results);

}

// Closing the database connection
$pdo = null;
$query = null;