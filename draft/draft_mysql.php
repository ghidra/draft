<?php
require_once '../rad/backend/mysql.php';
class draft_mysql extends mysql{
	
	var $mysql_compounds_table = 'compounds';
	var $mysql_categories_table = 'categories';
	var $mysql_storage_table = 'storage';

	public function __construct(){
		parent::__construct();
		//let's check for tables to see if we need to reate tables. just check for one
		if(!$this->table_exists($this->mysql_compounds_table))
		{
			$this->create_compounds_table();
			$this->create_categories_table();
			$this->create_storage_table();
		}
	}

	function create_compounds_table(){
		if(!$this->table_exists($this->mysql_compounds_table))
		{
			mysqli_query($this->conn,"CREATE TABLE $this->mysql_compounds_table(
				id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
				name TINYTEXT NOT NULL,
				created DATETIME,
				category INT(11) NOT NULL,
				version INT(11) NOT NULL,
				storage INT(11) NOT NULL
				)")or die ($this->errMsg = mysqli_error($this->conn));
		}
	}
	function create_categories_table(){
		if(!$this->table_exists($this->mysql_categories_table))
		{
			mysqli_query($this->conn,"CREATE TABLE $this->mysql_categories_table(
				id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
				name TINYTEXT NOT NULL
				)")or die ($this->errMsg = mysqli_error($this->conn));
		}
	}
	function create_storage_table(){
		if(!$this->table_exists($this->mysql_storage_table))
		{
			mysqli_query($this->conn,"CREATE TABLE $this->mysql_storage_table(
				id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
				data MEDIUMTEXT NOT NULL
				)")or die ($this->errMsg = mysqli_error($this->conn));
		}
	}

	////////////////////////////////////////
	// GETTERS
	////////////////////////////////////////

	public function get_compound_list()
	{
		$payload = new stdClass();

		$raw_compounds =  mysqli_query($this->conn,"SELECT * FROM $this->mysql_compounds_table ORDER BY id DESC") or die($this->errMsg = 'Error, getting all compounds '. mysqli_error());
		$count_compounds=0;
		$arr_compounds=array();
		while($info_compounds = mysqli_fetch_array( $raw_compounds ))
		{
			$arr_compounds[$count_compounds] = $info_compounds;
			$count_compounds++;
		}

		$raw_categories =  mysqli_query($this->conn,"SELECT * FROM $this->mysql_categories_table ORDER BY id DESC") or die($this->errMsg = 'Error, getting all categories '. mysqli_error());
		$count_categories=0;
		$arr_categories=array();
		while($info_categories = mysqli_fetch_array( $raw_categories ))
		{
			$arr_categories[$count_categories] = $info_categories;
			$count_categories++;
		}
		return $arr_categories;

		$payload->compounds = $arr_compounds;
		$payload->categories = $arr_categories;

		return $payload;
	}

	public function get_categories()
	{
		$payload = new stdClass();
		$raw_categories =  mysqli_query($this->conn,"SELECT * FROM $this->mysql_categories_table ORDER BY id DESC") or die($this->errMsg = 'Error, getting categories '. mysqli_error());
		$count_compounds=0;
	}

	////////////////////////////////////////
	// SETTERS
	////////////////////////////////////////
	public function save_script($name,$data)
	{
		$query_storage = "INSERT INTO $this->mysql_storage_table ( data ) VALUES ( '$data' )";
		$success_storage = mysqli_query($this->conn,$query_storage) or die($this->errMsg = 'Error, saving script data ' . mysqli_error($this->conn));
		
		$payload = new stdClass();
		$payload->success = 0;
		$payload->error = '';
		
		if($success_storage)
		{
			$script_id = $this->conn->insert_id;
			$payload->id = $script_id;
			//$script_id = mysql_insert_id();

			//now i need to see if I have something with this name already and up the version
			$version = 0;
			//check category, if it's a new category make that too
			$category = 0;
			///time
			$time = date("Y-m-d H:i:s");//time();//
			//if we are clear to send it in
			$query_compounds = "INSERT INTO $this->mysql_compounds_table (name,created,category,version,storage) VALUES ('$name','$time',$category,$version,$script_id)";
			$success_compounds = mysqli_query($this->conn,$query_compounds) or die($this->errMsg = 'Error, saving compound pointer ' . mysqli_error($this->conn));
			if($success_compounds)
			{
				$payload->success=1;
			}
			else
			{
				$payload->error .= "COMPOUND ENTRY FAILED:" . $success_compounds . " -- ";
			}
		}
		else
		{
			$payload->error .= "STORAGE ENTRY FAILED:" . $success_storage . " -- ";
		}

		return $payload;
	}
}
?>