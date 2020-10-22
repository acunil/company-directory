<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getAll.php

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	
	
	$optional = '';

	if(strlen($_REQUEST['firstName']) > 0) {
		$prefix = '';
		if(strlen($optional) == 0) {
			$prefix = 'WHERE ';
		} else {
			$prefix = 'AND ';
		}
		$optional = $optional . $prefix . 'p.firstName = "' . $_REQUEST['firstName'] . '" ';
	}

	if(strlen($_REQUEST['lastName']) > 0) {
		$prefix = '';
		if(strlen($optional) == 0) {
			$prefix = 'WHERE ';
		} else {
			$prefix = 'AND ';
		}
		$optional = $optional . $prefix . 'p.lastName = "' . $_REQUEST['lastName'] . '" ';
	}

	if(strlen($_REQUEST['id']) > 0) {
		$prefix = '';
		if(strlen($optional) == 0) {
			$prefix = 'WHERE ';
		} else {
			$prefix = 'AND ';
		}
		$optional = $optional . $prefix . 'p.id = "' . $_REQUEST['id'] . '" ';
	}

	if(strlen($_REQUEST['department']) > 0) {
		$prefix = '';
		if(strlen($optional) == 0) {
			$prefix = 'WHERE ';
		} else {
			$prefix = 'AND ';
		}
		$optional = $optional . $prefix . 'd.name = "' . $_REQUEST['department'] . '" ';
	}

	if(strlen($_REQUEST['location']) > 0) {
		$prefix = '';
		if(strlen($optional) == 0) {
			$prefix = 'WHERE ';
		} else {
			$prefix = 'AND ';
		}
		$optional = $optional . $prefix . 'l.name = "' . $_REQUEST['location'] . '" ';
	}

	$query = 'SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p  LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) ' . $optional . ' ORDER BY p.lastName, p.firstName, p.id, d.name, l.name';



	$result = $conn->query($query);
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}
   
   	$data = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>