<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$route['logout'] = 'auth/logout';

$route['save'] = 'canvas/save';

$route[':any'] = 'canvas/display';

$route['default_controller'] = 'canvas/new';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;
