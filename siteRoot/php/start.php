<?php
header('Content-Type: text/html; charset=utf-8');

$areas = file_get_contents("json/areas.json");
$areas = json_decode($areas);

foreach($areas as $name => $filename) {
    $noZip = substr($filename, 0, -4);
    echo("<a href='./show/$noZip'>$name</a><br/>");
}

?>