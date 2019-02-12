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
    });

    $(window).resize(function(){
        canvas.setWidth( $(window).width() - 20);
        canvas.setHeight( $(window).height() - 90 );
        canvas.calcOffset();
    });

<<<<<<< HEAD
    //----------- Show and hide controls on hover ------->

    canvas.on('mouse:over', function(opt){
        var id = opt.target.id;
        $('.hex_controls').filter('[data-hex-id=' + id + ']').show();
    });
    canvas.on('mouse:out', function(opt){
        var id = opt.target.id;
        $('.hex_controls').filter('[data-hex-id=' + id + ']').hide();
    });

    //-------------- zoom -------------------------------->

     // canvas.on('mouse:wheel', function(opt) {
    //   var delta = opt.e.deltaY;
    //   var pointer = canvas.getPointer(opt.e);
    //   var zoom = canvas.getZoom();
    //   zoom = zoom + delta/200;
    //   if (zoom > 20) zoom = 20;
    //   if (zoom < 0.01) zoom = 0.01;
    //   canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    //
    //   console.log( pointer );
    //
    //   //loop the objects and move their controlls and labels
    //   var objs = canvas.getObjects();
    //   var controls = $('.hex_controls');
    //   var labels = $('.hex_label');
    //
    //
    //
    //   for(var i = 0; i < objs.length; i++){
    //     var ctl = controls.filter('[data-hex-id=' + objs[i].id + ']');
    //
    //     var label = labels.filter('[data-hex-id=' + objs[i].id + ']');
    //
    //     //ctl.css('transform-origin', opt.e.offsetX + 'px ' + opt.e.offsetY + 'px');
    //     //ctl.css('transform', 'scale('+ zoom +')');
    //
    //     if( label ){
    //         //positionText( objs[i], label );
    //     }
    //   }
    //
    //   opt.e.preventDefault();
    //   opt.e.stopPropagation();
    //
    // });
    //
    // //pan
    // canvas.on('mouse:down', function(opt) {
    //   var evt = opt.e;
    //   if (evt.altKey === true) {
    //     this.isDragging = true;
    //     this.selection = false;
    //     this.lastPosX = evt.clientX;
    //     this.lastPosY = evt.clientY;
    //   }
    // });
    // canvas.on('mouse:move', function(opt) {
    //   if (this.isDragging) {
    //     var e = opt.e;
    //     this.viewportTransform[4] += e.clientX - this.lastPosX;
    //     this.viewportTransform[5] += e.clientY - this.lastPosY;
    //     this.renderAll();
    //     this.lastPosX = e.clientX;
    //     this.lastPosY = e.clientY;
    //
    //   }
    // });
    // canvas.on('mouse:up', function(opt) {
    //   this.isDragging = false;
    //   this.selection = true;
    // });

=======
>>>>>>> parent of a23768d... hover hex controls, not working
});
