<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$route['logout'] = 'auth/logout';

$route['save'] = 'canvas/save';

$route['saved'] = 'user/canvas_list';

$route['formation/(:any)'] = 'canvas/display/$1';


$route['default_controller'] = 'canvas/new';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;
