<?php
header("Content-Type: application/json");
if(isset($_GET['version'])){
    $file = $_GET['version'] . ".txt";
    if(file_exists($file)){
        $f = file_get_contents($file);
        $exp = explode(PHP_EOL, $f);
        $matchLine = $exp[0];
        unset($exp[0]);
        $def = array($matchLine, array_values($exp));
        echo json_encode($def);
    }
}