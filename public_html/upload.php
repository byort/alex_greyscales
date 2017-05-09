<?php 
    $date = date('hi_d_m');
    $target_dir = "data/";
    $target_file = $target_dir . $date. '.csv';
    $string = $_POST['string'];
    $csvhandler = fopen($target_file, 'w');
    fwrite($csvhandler, $string);
    fclose($csvhandler); 
?>