<?php

//require_once 'rad/draft_mysql.php';
//require_once 'rad/backend/login.php';

/*function attemp_login($payload){
	//$mysql = new draft_mysql();
	$login = new login($mysql,$payload);

	if(!$login->logged_in)
	{
		return $mysql->errMsg . $login->errMsg . $login->get_login_page();
	}
	else
	{
		//get the user information

		//return html_logout_button();
		return "LOG OUT???";
	}
}*/

if ( isset($_GET['q'])  )
{
	$q = $_GET['q'];

	if($q=='logout')
	{
		//$logout = new logout();
		//echo attemp_login($_GET);
	}

	if($q=='login')	
	{
		if(isset($_SESSION['logged_in']))
		{
			//echo html_logout_button();
			echo "LOG OUT???";
		}
		else
		{
			echo "LOG IN???";
			//echo attemp_login($_GET);//json_decode($_GET['payload'],true);
		}
	}
}
////passwords are send via post
if ( isset($_POST['q'])  )
{
	if($_POST['q']=='login')
	{
		echo "hep";//attemp_login($_POST);
	}
}
?>