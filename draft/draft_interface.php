<?php

require_once 'draft_mysql.php';
require_once '../rad/backend/login_interface.php';

function get_compound_list($payload){
	if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true)
	{
		$mysql = new draft_mysql();
		return $mysql->get_compound_list();
	}
}
if ( isset($_GET['q'])  )
{
	$q = $_GET['q'];

	if($q=='get_compound_list')
	{
		echo json_encode(get_compound_list($_GET));
	}
}
////passwords are send via post
if ( isset($_POST['q'])  )
{
	/*if($_POST['q']=='login')
	{
		echo attemp_login($_POST);
	}*/
}
?>