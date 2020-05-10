<?php

require_once 'draft_mysql.php';
require_once '../rad/backend/login_interface.php';

function get_categories()
{
	$mysql = new draft_mysql();
	return $mysql->get_categories();
}
function get_categories_and_compounds()
{
	$mysql = new draft_mysql();
	return $mysql->get_categories_and_compounds();
}
function get_compound($name)
{
	$mysql = new draft_mysql();
	return $mysql->get_compound($name);
}
////////////////////////////////////
///////////////////////////////////

if ( isset($_GET['q'])  )
{
	$q = $_GET['q'];

	if($q=='get_categories')
	{
		echo json_encode(get_categories());
	}
	if($q=='get_categories_and_compounds')
	{
		echo json_encode(get_categories_and_compounds());
	}
	if($q=='get_compound')
	{
		echo json_encode(get_compound($_GET['compound_name']));
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