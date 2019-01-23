<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Canvas extends MY_Controller{

	public function __construct(){
		parent::__construct();
	}
	public function index(){
		
	}

	public function new(){

		$this->load->view('welcome_message');
	}

}
