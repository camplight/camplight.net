<?php
$CDIR = dirname(__FILE__);
require_once($CDIR."/rb.php");
require_once($CDIR."/mysql-credentials.php");

R::setup('mysql:host='.MYSQL_HOST.';dbname='.MYSQL_DB,MYSQL_USER,MYSQL_PASS);

function hasValidGetArguments() {
    return isset($_GET['name']) && isset($_GET['email']) && isset($_GET['link']);
}

if(hasValidGetArguments()) {
    $request = R::dispense( 'memberRequest' );
    $request->name = $_GET['name'];
    $request->email = $_GET['email'];
    $request->link = $_GET['link'];
    $id = R::store($request);
}

$response = "";
if(isset($_GET['callback']))
    $response = $_GET['callback']."(";
$response .= '{"status":"'. ( $id > 0 ? "succeeded" : "failed" ) . '"}';
if(isset($_GET['callback']))
    $response .= ");";

echo $response;
?>