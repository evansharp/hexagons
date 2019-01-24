<?php

class MY_Controller extends CI_Controller {


	public function __construct() {
		parent::__construct();

		if( !isset( $_SESSION['logged_in']) ){
			$_SESSION['logged_in'] = false;
		}

		// include the Google API lib
		include_once APPPATH . "libraries/google-api-php-client-2.2.2/vendor/autoload.php";

		$redirect_uri = base_url();

		// Create Client Request to access Google API
		$client = new Google_Client();
		$client->setAuthConfig( FCPATH . 'client_secret.json');
		$client->setApplicationName("Hexagons");
		$client->setRedirectUri( $redirect_uri );
		$client->setAccessType('offline');

		$client->addScope("https://www.googleapis.com/auth/userinfo.profile");
		$client->addScope("https://www.googleapis.com/auth/userinfo.email");

		// Add Access Token to Session
		if (isset($_GET['code'])) {
  			$_SESSION['id_token_token'] = $client->fetchAccessTokenWithAuthCode($_GET['code']);
  			// redirect back to the example
  			header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
  			return;
		}

		if ( !empty($_SESSION['id_token_token']) && isset($_SESSION['id_token_token']['id_token']) ) {
			$client->setAccessToken( $_SESSION['id_token_token'] );


			$OAuthService = new Google_Service_Oauth2( $client );

			$_SESSION['googleProfile'] = $OAuthService->userinfo->get();
			$_SESSION['logged_in'] = true;

		} else {
  			$_SESSION['authUrl'] = $client->createAuthUrl();
		}

	}

	public function index() {
	}
}
