<?php

require_once "dbh.inc.php";

// Preparing and executing the query
$query = $pdo->prepare("SELECT id FROM groups ORDER BY RAND();");
$query->execute();

// Fetching the data as an associative array
$results = $query->fetchAll(PDO::FETCH_ASSOC);

// Converting result/server response to JSON format
echo json_encode($results);

// Closing the database connection
$pdo = null;
$query = null;