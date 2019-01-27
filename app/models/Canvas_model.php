<?php

class Canvas_model extends MY_Model{

    public function __construct(){
        parent::__construct();
    }

    public function get_canvas( $canvas_id ){

        $this->db->select( '*' );
        $this->db->where( 'canvas_id', $canvas_id );
        $this->db->limit( 1 );
        $q = $this->db->get( $this->data_table );

        if($q->num_rows() > 0){
            $r = $q->result_array();
            return $r[0];
        }else{
            return false;
        }
    }

    public function save_canvas( $user_id, $canvas_id, $canvas_data ){
        $rt = ['msg' => null, 'id' => null, 'success' => null];

        if( $canvas_id == '' ){
            //this is a new save, so generate an id

            $canvas_id = substr( bin2hex( random_bytes( 40 ) ), 0, 39); // make a psudeorandom string for 40 chars
            $rt['id'] = $canvas_id;

        }else{
            //otherwise verify this belongs to the logged-in user
            $old_save = $this->get_canvas( $canvas_id );

            if( $old_save['user_id'] != $user_id){
                $rt['msg'] = "You do not have permission to overwrite this formation.";
                $rt['success'] = false;
                return $rt;
            }

        }

        $data = [
                'canvas_id' =>  $canvas_id,
                'user_id'   =>  $user_id,
                'canvas'    =>  $canvas_data
        ];
        if( $this->db->replace($this->data_table, $data) ){
            $rt['msg'] = "Save successful!";
            $rt['id'] = $canvas_id;
            $rt['success'] = true;
            return $rt;
        }else{
            $rt['msg'] = "There was an error saving to the DB.";
            $rt['id'] = $canvas_id;
            $rt['success'] = false;
            return $rt;
        }
    }

}
