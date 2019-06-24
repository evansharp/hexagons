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

function getContrastyColour(picked){
    //function from https://codepen.io/davidhalford/pen/ywEva

    var threshold = 130; /* about half of 256. Lower threshold equals more dark text on dark background  */
    var hRed = hexToR(picked);
    var hGreen = hexToG(picked);
    var hBlue = hexToB(picked);

    function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
    function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
    function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
    function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

    cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
    if (cBrightness > threshold){
        return "#333";
    } else {
        return "#fefefe";
    }

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
