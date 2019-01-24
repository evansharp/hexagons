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

	public function save(){
		$user_id = $_POST['user_id'];
		$canvas_id = $_POST['canvas_id'];
		$canvas_data = $_POST['canvas_data'];

		$cm = new Canvas_model();
		echo json_encode( $cm->save_canvas( $user_id, $canvas_id, $canvas_data ) );
	}


	public function display( $canvas_id ){
		if( strlen($canvas_id) != 40 ){
			redirect( base_url() );
		}

		$cm = new Canvas_model();
		$result = $cm->get_canvas( $canvas_id );

		// display data
		$page_data = [
			'canvas' => $result['canvas_data']
		];

		$template_data['page']  = $this->load->view('canvas', $page_data ,TRUE);
    	$this->load->view('template', $template_data);
	}

}
