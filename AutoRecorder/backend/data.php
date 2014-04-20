<?php
header("Content-Type: application/json");
if(isset($_GET['version'])){
    $file = $_GET['version'] . ".txt";
    if(file_exists($file)){
        $f = file_get_contents($file);
        $exp = explode(PHP_EOL, $f);
        echo json_encode($exp);
    }
}