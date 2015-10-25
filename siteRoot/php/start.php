<?php
header('Content-Type: text/html; charset=utf-8');

$areas = file_get_contents(getenv("DATA_PATH") . "/static/areas.json");
$areas = json_decode($areas);

foreach($areas as $name => $filename) {
    echo("<a href='./show/$filename'>$name</a><br/>");
}

?>