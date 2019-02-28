function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getIntersections(path1, path2) {
    return intersections = path1.getIntersections(path2);
}

// check sessionStorage for a canvas in case the user just logged-in
// make sure not to over-write a hash-labeled canvas sent from the server already
if( sessionStorage.getItem("canvasData") && !canvasData ){
    var canvasData = sessionStorage.getItem("canvasData");
    $('#formation_title').children('span').text( sessionStorage.getItem("canvasTitle") )
    console.log('loaded from sessionStorage');
}else if(!canvasData){
    //init a new session without loading anything
    var canvasData = false;
}
if( sessionStorage.getItem('formationURL') ){
    window.history.replaceState(null, "Formation Loaded", 'formation/' + sessionStorage.getItem('formationURL'));
}
