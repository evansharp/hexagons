<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth extends CI_Controller{

    public function __construct(){
		parent::__construct();
	}

    public function logout(){
		unset($_SESSION['id_token_token']);
		unset($_SESSION['googleProfile']);
		unset($_SESSION['logged_in']);
		redirect( base_url() );
	}
}
?>
