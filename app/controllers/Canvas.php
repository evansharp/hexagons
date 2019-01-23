<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Canvas extends Base_controller {

	public function __construct(){

	}
	public function index(){}

	public function new(){

		$this->load->view('welcome_message');
	}

}
