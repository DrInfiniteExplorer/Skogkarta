<?php
header('Content-Type: application/json; charset=utf-8');
function param($a)
{
   if(array_key_exists($a, $_REQUEST)){
      return $_REQUEST[$a];
   }
}

$area=param("area");
$data=param("data");

if($area and $data)
{

    $path_parts = pathinfo($area);
    $file_name  = $path_parts['basename'];
    $area  = $file_name;

    $path_parts = pathinfo($data);
    $file_name  = $path_parts['basename'];
    $data  = $file_name;

    readfile("./json/$area/$data.json");
}
else
{
    exit;
}
?>