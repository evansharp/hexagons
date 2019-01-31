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
    public function delete_canvas( $user_id, $canvas_id){
        $rt = ['msg' => null, 'id' => null, 'success' => null];

        $old_save = $this->get_canvas( $canvas_id );

        if( $old_save['user_id'] != $user_id){
            $rt['msg'] = "You do not have permission to delete this formation.";
            $rt['success'] = false;
            return $rt;
        }
        if( $this->db->delete( $this->data_table, ['canvas_id' => $canvas_id] ) ){
            $rt['msg'] = "Formation Deleted";
            $rt['id'] = $canvas_id;
            $rt['success'] = true;
            return $rt;
        }else{
            $rt['msg'] = "There was an error editing to the DB.";
            $rt['id'] = $canvas_id;
            $rt['success'] = false;
            return $rt;
        }
    }

    public function save_canvas( $user_id, $canvas_id, $canvas_data ){
        $rt = ['msg' => null, 'id' => null, 'success' => null];
        $new = false;

        if( $canvas_id == '' ){
            //this is a new save, so generate an id

            $canvas_id = substr( bin2hex( random_bytes( 40 ) ), 0, 39); // make a psudeorandom string for 40 chars
            $rt['id'] = $canvas_id;
            $new = true;

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
        if( $new ){
            //new save so set the 'created' field
            $data['created'] = date("Y-m-d H:i:s");
        }else{
            $data['created'] = $old_save['created'];
        }
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

    public function get_all_canvases_by_user( $user_id ){
        $this->db->select( '*' );
        $this->db->where( 'user_id', $user_id );
        $q = $this->db->get( $this->data_table );

        if( $q->num_rows() > 0 ){
            return $q->result_array();
        }elseif( $q->num_rows() == 0 ){
            return [];
        }else{
            return false;
        }
    }

}
