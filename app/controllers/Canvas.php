<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Canvas extends MY_Controller{

	public function __construct(){
		parent::__construct();
	}
	public function index(){
	}

	public function new(){
		//not logged-in
		$template_data['page']  = '';

		// display data
		$page_data = [];

    	$this->load->view('template', $template_data);
	}

}
