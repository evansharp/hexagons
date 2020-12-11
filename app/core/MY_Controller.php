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
		$client->setApprovalPrompt('force');

		$client->addScope("https://www.googleapis.com/auth/userinfo.profile");
		$client->addScope("https://www.googleapis.com/auth/userinfo.email");

		// Add Access Token to Session
		if (isset($_GET['code'])) {
  			$_SESSION['id_token_token'] = $client->fetchAccessTokenWithAuthCode($_GET['code']);
			$_SESSION['google_refresh_token'] = $client -> getRefreshToken();

			// redirect back to the example
  			header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
		}

		if ( !empty($_SESSION['id_token_token']) && isset($_SESSION['id_token_token']['id_token']) ) {
			$client->setAccessToken( $_SESSION['id_token_token'] );

			if ($client->isAccessTokenExpired()) {
				$regenerated_access_token = $client->fetchAccessTokenWithRefreshToken( $_SESSION['user']['google_refresh_token'] );

				$client->setAccessToken( $regenerated_access_token );

				$_SESSION['access_token'] = $client->getAccessToken();
  			}

			if( !isset( $_SESSION['logged_in'] ) || !$_SESSION['logged_in'] ){

				$OAuthService = new Google_Service_Oauth2( $client );

				$googleProfile = $OAuthService->userinfo->get();


				$um = new User_model();
				$user = $um->get_user( $googleProfile['email'] );

				if( !$user ){
					$_SESSION['user_id'] = $um->new_user(
											$googleProfile['email'],
											$googleProfile['givenName'],
											$googleProfile['picture'],
											$_SESSION['google_refresh_token']
										);
				}else{
					$um->record_login( $googleProfile['email'] );
				}

				$_SESSION['user'] = $um->get_user( $googleProfile['email'] );
				if( $_SESSION['user'] ){
					$_SESSION['logged_in'] = true;
				}
			}
		} else {
  			$_SESSION['authUrl'] = $client->createAuthUrl();
		}

	}

	public function index() {
	}
}
