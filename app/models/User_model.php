<?php

class User_model extends MY_Model{

    public function __construct(){
        parent::__construct();
    }

    public function get_user( $email ){
        $q = $this->db->get_where( $this->user_table, ['email' => $email], 1 );
        if($q->num_rows() > 0){
            $r =  $q->result_array();
            return $r[0];
        }

        return array();
    }

    public function new_user( $email, $name, $picutre, $refresh_token ){
        //create user table entry
        $data = [   'email' => $email,
                    'name' => $name,
                    'google_avatar' => $picutre,
                    'google_refresh_token' => $refresh_token
                ];

        $this->db->insert($this->user_table, $data);

        return $this->db->insert_id();
    }

    public function get_all_users(){
	    $q = $this->db->get( $this->user_table );
        if($q->num_rows() > 0){
            return $q->result_array();
        }
        return array();
    }
    public function record_login( $email ){
        $data = [
            'last_login' => date('Y-m-d H:i:s')
        ];
        $this->db->where('email', $email);
        $this->db->update($this->user_table, $data);

    }
}
