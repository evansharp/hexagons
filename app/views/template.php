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
        <header id="header" class="z-depth-2">
            <a href="<?php echo base_url();?>" class="homelink">
                <img src="<?php echo base_url();?>assets/img/logo.svg" alt="logo" id="title_logo">
                <h1>Hexagons</h1>
            </a>

            <?php if( $_SESSION['logged_in'] ): ?>
				<img src="<?php echo $_SESSION['googleProfile']['photoUrl']; ?>" alt="" class="user_img">
				<a href="<?php echo base_url();?>logout" id="logout_button" class="waves-effect btn-flat">
                    Logout
                </a>
        	<?php else: ?>
        		<a href="<?php echo $_SESSION['authUrl']; ?>" id="login_button" class="waves-effect btn-flat">
                    <i class="small material-icons left">account_circle</i> Login
                </a>
        	<?php endif; ?>

        </header>

        <div class="row">

            <div class="col s10" id="content-wrapper">
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
        <script src="<?php echo base_url();?>assets/js/ui.js" type="text/javascript"></script>
    </body>
</html>
