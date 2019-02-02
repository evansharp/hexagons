var canvas = {};
var hex_id_counter = 0;

fabric.Canvas.prototype.getAbsoluteCoords = function(object) {
    return {
      left: object.left + this._offset.left,
      top: object.top + this._offset.top
  };
}

function positionCtl( canvas, obj, ctls ){
    var absCoords = canvas.getAbsoluteCoords( obj );
    ctls.style.left = (absCoords.left + 25) + 'px';
    ctls.style.top = (absCoords.top + 1) + 'px';
}

function positionText( canvas, obj, text ){
    var absCoords = canvas.getAbsoluteCoords( obj );
    text.style.left = (absCoords.left) + 'px';
    text.style.top = (absCoords.top + 30) + 'px';
}


$(document).ready(function(){
    canvas = new fabric.Canvas('c',{
        height:	window.innerHeight - 90,
        width: window.innerWidth - 20
    });

    $(window).resize(function(){
        canvas.setWidth( $(window).width() - 20);
        canvas.setHeight( $(window).height() - 90 );
        canvas.calcOffset();
    });

});
