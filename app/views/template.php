<!DOCTYPE html>
<html lang="en">
    <head>
    	<meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

    	<title>Hexagons</title>

        <link href="https://fonts.googleapis.com/icon?family=Lato:300|Roboto:100,300,500|Material+Icons" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
        <link href="<?php echo base_url();?>assets/css/jquery.colorwheel.css" rel="stylesheet" type="text/css" />
        <link href="<?php echo base_url();?>assets/css/main.css?v=<?php echo time();?>" rel="stylesheet" type="text/css" />
    </head>

    <body>
        <?php //var_dump($_SESSION['googleProfile']); ?>
        <nav>
            <div class="nav-wrapper">
                <a href="<?php echo base_url();?>" class="homelink">
                    <img src="<?php echo base_url();?>assets/img/logo.svg" alt="logo" id="title_logo">
                    <h1>Hexagons</h1>
                </a>


                    <ul class="right hide-on-med-and-down">
                        <?php if( $_SESSION['logged_in'] ): ?>
                            <?php if( !isset($hide_save) ): ?>
                                <li><a href="<?php echo base_url();?>">New</a></li>
                                <li><a href="" id="save_button">Save</a></li>
                                <li><a href="" id="delete_button">Delete</a></li>
                                <li><a href="" id="duplicate_button">Make a Copy</a></li>
                            <?php elseif( isset($user_area) ): ?>
                                <li><a href="<?php echo base_url();?>">New Formation</a></li>
                            <?php endif; ?>

                        <!-- Dropdown Trigger -->
                        <li>
                            <ul id="usermenu" class="dropdown-content">
                                <li><a href="<?php echo base_url();?>saved">View Saved</a></li>
                                <li class="divider"></li>
                                <li><a href="<?php echo base_url();?>logout">Logout</a></li>
                            </ul>
                            <a class="dropdown-trigger" href="#!" data-target="usermenu">
                                <div class="valign-wrapper">
                                    <img src="<?php echo $_SESSION['googleProfile']['picture']; ?>" alt="" class="user_img">
                                    <?php echo $_SESSION['googleProfile']['givenName']; ?>
                                </div>
                            </a>
                        </li>
                        <?php else: ?>

                            <li><a href="<?php echo $_SESSION['authUrl']; ?>" id="loginlink">
                                <i class="small material-icons left">account_circle</i> Login
                            </a></li>
                        <?php endif; ?>
                    </ul>
            </div>
        </nav>

        <div class="row">
            <div class="col s12">
                <?php echo $page; ?>
            </div>
        </div>

        <div id="title_modal" class="modal">
            <div class="modal-content">
                <h4>Edit Formation Title</h4>
                <input placeholder="Title" id="edit_title_input" type="text">
            </div>
            <div class="modal-footer">
                <a href="#!" class="modal-close waves-effect waves-red btn-flat">Set</a>
            </div>
        </div>

        <div id="label_modal" class="modal">
            <div class="modal-content">
                <h4>Edit Hexagon Label</h4>
                <input placeholder="Label" id="edit_label_input" type="text" maxlength="25">
                <span class="maxlength_notice">25 character limit</span>
                <span id="edit_label_id"></span>
            </div>
            <div class="modal-footer">
                <a href="#!" class="modal-close waves-effect waves-red btn-flat">Set</a>
            </div>
        </div>

        <div id="about_modal" class="modal modal-fixed-footer">
            <div class="modal-content">

            </div>
            <div class="modal-footer">
                <a href="#!" class="modal-close waves-effect waves-red btn-flat">Close</a>
            </div>
        </div>

        <div id="policy_modal" class="modal modal-fixed-footer">
            <div class="modal-content">

            </div>
            <div class="modal-footer">
                <a href="#!" class="modal-close waves-effect waves-red btn-flat">Close</a>
            </div>
        </div>

        <script src="//code.jquery.com/jquery-2.1.4.min.js" type="text/javascript"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.js" type="text/javascript"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.0/paper-full.min.js"></script>
        <script src="<?php echo base_url();?>assets/js/jquery.colorwheel.js"></script>

        <script type="text/javascript">
            var baseurl = "<?php echo base_url();?>";

            <?php
                //condiionally pass some data to js from the server

                if( isset( $_SESSION['user_id'] ) ){
                    echo "var userid = " . $_SESSION['user_id'] . ";";
                }else{
                    echo "var userid = false;";
                }
                if( isset( $canvas ) ){
                    echo "var canvasData = '$canvas';";
                }
                if( $this->session->flashdata('flash') ){
                    echo "M.toast({html: '" . $this->session->flashdata('flash') . "' });";
                }
            ?>
        </script>
        <script src="<?php echo base_url();?>assets/js/util.js?v=<?php echo time();?>" type="text/javascript"></script>

        <?php if( isset( $user_area ) ):?>
            <script src="<?php echo base_url();?>assets/js/admin.js?v=<?php echo time();?>" type="text/javascript"></script>
        <?php else: ?>
            <script src="<?php echo base_url();?>assets/js/canvas.js?v=<?php echo time();?>" type="text/javascript" canvas="c"></script>
            <script src="<?php echo base_url();?>assets/js/ui.js?v=<?php echo time();?>" type="text/javascript"></script>
        <?php endif; ?>
    </body>
</html>
