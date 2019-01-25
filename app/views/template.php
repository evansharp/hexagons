<!DOCTYPE html>
<html lang="en">
    <head>
    	<meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

    	<title>Hexagons</title>

        <link href="https://fonts.googleapis.com/icon?family=Lato:300|Roboto:100,300,500|Material+Icons" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
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
                        <li><a href="" id="save_button">Save</a></li>
                        <li><a href="#!">Delete</a></li>
                        <li><a href="#!">Duplicate</a></li>

                        <!-- Dropdown Trigger -->
                        <li>
                            <ul id="usermenu" class="dropdown-content">
                                <li><a href="#!">View Saved</a></li>
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

                            <li><a href="<?php echo $_SESSION['authUrl']; ?>">
                                <i class="small material-icons left">account_circle</i> Login
                            </a></li>
                        <?php endif; ?>
                    </ul>
            </div>
        </nav>




        </header>

        <div class="row">
            <div class="col s12">
                <?php echo $page; ?>
            </div>

        </div>

        <footer id="footer"></footer>

        <div id="loader_modal" class="modal">
            <div class="modal-content">
                <img src="<?php echo base_url();?>assets/img/prism_loader.gif" alt="">
                <p>Loading...</p>
            </div>
        </div>

        <script src="//code.jquery.com/jquery-2.1.4.min.js" type="text/javascript"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/1.7.22/fabric.min.js"></script>
        <script type="text/javascript">
            var baseurl = "<?php echo base_url();?>";
            var userid = "<?php echo $_SESSION['user_id']; ?>";
            var canvasData = "<?php echo $_SESSION['canvas'];";
        </script>
        <script src="<?php echo base_url();?>assets/js/ui.js?v=<?php echo time();?>" type="text/javascript"></script>
    </body>
</html>
