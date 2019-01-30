<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User extends MY_Controller{
	protected $user_id;

	public function __construct(){
		parent::__construct();

		if( isset( $_SESSION['user_id'] ) )
			$this->user_id = $_SESSION['user_id'];
		else{
			//set flashdata: not logged in
			redirect( base_url() );
		}
	}
	public function index(){
	}

	public function canvas_list(){
		$cm = new Canvas_model();

		$page_data['canvas_list'] = $cm->get_all_canvases_by_user( $this->user_id );

		$template_data['hide_save'] = true;
		$template_data['user_area'] = true;
		$template_data['page']  = $this->load->view('users_canvas_list', $page_data ,TRUE);

    	$this->load->view('template', $template_data);
	}


}
