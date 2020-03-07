<?php
require_once '../rad/backend/mysql.php';
class draft_mysql extends mysql{
	
	/*var $mysql_people_table = 'people';
	var $mysql_jobs_table = 'jobs';
	var $mysql_time_table = 'time';
	var $mysql_timemod_table = 'timemod';*/

	public function __construct(){
		
		parent::__construct();

		
		//TMP
		//$this->init_tables($this->user_table);
	}
}
?>