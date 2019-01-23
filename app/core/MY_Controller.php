<?php

class MY_Controller extends CI_Controller {


	public function __construct() {
		parent::__construct();

		if( !isset( $_SESSION['logged_in']) ){
			$_SESSION['logged_in'] = false;
		}

		// include the Google API lib
		include_once APPPATH . "libraries/google-api-php-client-2.2.2/vendor/autoload.php";

		// Create Client Request to access Google API
		$client = new Google_Client();
		$client->setAuthConfig( FCPATH . 'client_secret.json');
		$client->setApplicationName("Hexagons");
		$client->setRedirectUri( base_url() );
		$client->setAccessType('offline');

		$client->addScope("https://www.googleapis.com/auth/classroom.profile.photos");
		$client->addScope("https://www.googleapis.com/auth/classroom.profile.emails");

		// Add Access Token to Session
		if (isset($_GET['code'])) {
  			$_SESSION['id_token_token'] = $client->fetchAccessTokenWithAuthCode($_GET['code']);
  			// redirect back to the example
  			header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
  			return;
		}

		if ( !empty($_SESSION['id_token_token']) && isset($_SESSION['id_token_token']['id_token']) ) {
  			$client->setAccessToken( $_SESSION['id_token_token'] );

			$oauth = new Google_Oauth2Service($client);
			$_SESSION['googleProfile'] = $oauth->userinfo->get();

		} else {
  			$_SESSION['authUrl'] = $client->createAuthUrl();
		}
	}

	public function index() {
	}
}
