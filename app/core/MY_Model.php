<?php

class MY_Model extends CI_Model {

    protected $user_table;
    protected $data_table;

	public function __construct() {
		parent::__construct();

        $this->user_table = 'users';
        $this->data_table = 'data';
    }
}
