<?php

require_once 'draft_mysql.php';
require_once '../rad/backend/login_interface.php';

function get_compound_list($payload)
{
	if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true)
	{
		$mysql = new draft_mysql();
		return $mysql->get_compound_list();
	}
}

function get_categories()
{
	$mysql = new draft_mysql();
	return $mysql->get_categories();
}
////////////////////////////////////
///////////////////////////////////

if ( isset($_GET['q'])  )
{
	$q = $_GET['q'];

	if($q=='get_compound_list')
	{
		echo json_encode(get_compound_list($_GET));
	}
	if($q=='get_categories')
	{
		echo json_encode(get_categories());
	}
}
////passwords are send via post
if ( isset($_POST['q'])  )
{
	$payload = new stdClass();
	if($_POST['q']=='save_script')
	{
		if ( isset($_POST['data']) && isset($_POST['name']) && isset($_POST['category']) )
		{
			//we have data to save... lets' put it in the database
			$mysql = new draft_mysql();
			$payload->result = $mysql->save_script($_POST['name'],$_POST['data'],$_POST['category']);
		}
		//echo attemp_login($_POST);
		//$payload->result='we did it';
		echo(json_encode($payload));
	}
}
?>