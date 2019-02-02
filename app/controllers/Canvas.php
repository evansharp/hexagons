<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Canvas extends MY_Controller{
	protected $cm;

	public function __construct(){
		parent::__construct();
		$this->cm = new Canvas_model();
	}
	public function index(){
	}

	public function new(){
		// display data
		$page_data['title'] = 'Untitled';

		$template_data['page']  = $this->load->view('canvas', $page_data ,TRUE);
    	$this->load->view('template', $template_data);
	}

	public function save( $do_output = true){
		$user_id = $_POST['user_id'];
		$canvas_id = $_POST['canvas_id'];
		$canvas_data = $_POST['canvas_data'];
		$title = $_POST['title'];

		if( $do_output ){
			echo json_encode( $this->cm->save_canvas( $user_id, $canvas_id, $canvas_data, $title ) );
		}else{
			$this->cm->save_canvas( $user_id, $canvas_id, $canvas_data, $title );
		}
	}

	public function delete(){
		$id = $_POST['canvas_id'];
		$user_id = $_POST['user_id'];

		echo json_encode( $this->cm->delete_canvas( $user_id, $id) );
	}

	public function duplicate(){
		$this->save( false );

		$user_id = $_POST['user_id'];
		$canvas_id = '';	//empty will trigger a new id to be assigned when saved
		$canvas_data = $_POST['canvas_data'];

		$this->session->set_flashdata('flash', 'Formation Duplicated');
		echo json_encode( $this->cm->save_canvas( $user_id, $canvas_id, $canvas_data ) );
	}


	public function display( $canvas_id ){
		if( strlen( $canvas_id ) != 39 ){
			$this->session->set_flashdata('flash', 'Invalid Formation ID');
			redirect( base_url() );
		}

		$result = $this->cm->get_canvas( $canvas_id );

		$page_data['title'] = '';

		if( $result ){
			$template_data['canvas'] = $result['canvas'];
			$page_data['title'] = $result['title'];
		}

		$template_data['page']  = $this->load->view('canvas', $page_data ,TRUE);

    	$this->load->view('template', $template_data);
	}

}
