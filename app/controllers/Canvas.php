<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Canvas extends MY_Controller{


	public function __construct(){
		parent::__construct();
	}
	public function index(){
	}

	public function new(){

		// display data
		$page_data = [];

		$template_data['page']  = $this->load->view('canvas', $page_data ,TRUE);


    	$this->load->view('template', $template_data);
	}

	public function display($id){

	}

}
