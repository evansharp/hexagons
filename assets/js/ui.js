

function loading(){
    var i = M.Modal.getInstance( document.querySelector('#loader_modal') );
    i.open();
}

var hex_id_counter = 0;

fabric.Canvas.prototype.getAbsoluteCoords = function(object) {
    return {
      left: object.left + this._offset.left,
      top: object.top + this._offset.top
  };
}

function positionCtl( canvas, obj, ctls ){
    var absCoords = canvas.getAbsoluteCoords( obj );
    ctls.style.left = (absCoords.left + 24) + 'px';
    ctls.style.top = (absCoords.top + 1) + 'px';
}

function getControlGroupString(id){
    return '<div class="hex_controls" data-hex-id="' + id + '">' +
                '<div class="colorwheel"></div>'+
                '<a href="" class="hex_control colorwheel_handle"><i class="material-icons">color_lens</i></a>'+
                '<a href="" class="hex_control"><i class="material-icons">delete</i></a>'+
                '<a href="" class="hex_control"><i class="material-icons">text_fields</i></a>'+
            '</div>';
}

$(document).ready(function(){
    //init mterialize components
    $('.dropdown-trigger').dropdown();
    $('.fixed-action-btn').floatingActionButton();
    $('select').formSelect();
    $('.tooltipped').tooltip();
    $('.modal').modal();

    var canvas = new fabric.Canvas('c',{
        height:	window.innerHeight - 90,
        width: window.innerWidth - 20
    });

    if( canvasData ){
        //process canvas objects to add settings not exported properly
        var rough_canvas = JSON.parse( canvasData );
        $.each(rough_canvas.objects, function(i, canvas_item){
            canvas_item.hasBorders = false;
            canvas_item.hasControls = false;
            canvas_item.hasRotatingPoint = false;
            canvas_item.id = hex_id_counter; //restore an idea for control group
            $('#controls').append( getControlGroupString( hex_id_counter) ); //create control group
            hex_id_counter += 1; //increment counter for the next hexagon
        });
        console.log(rough_canvas);
        //stupid Fabric JS won't import an object...
        var fine_canvas = JSON.stringify( rough_canvas );
        canvas.loadFromJSON( fine_canvas );

        // init just-added color wheel controls
        $('.colorwheel').colorwheel();
    }

    // var grid = 120;
    // var grids = 104;
    //
	// var gridLen = canvas.width / grid;
    // var gridhieght = canvas.height / grids;
    //
    // for (var a = 0; a < gridhieght; a++){
    //     for (var i = 0; i < gridLen; i++) {
    //       var path = new fabric.Path('M0 51.96152422706631L30 0L90 0L120 51.96152422706631L90 103.92304845413263L30 103.92304845413263Z');
    //       canvas.add(path);
    //       path.set({
    //           left: i * grid,
    //           top: a * grids,
    //           stroke: '#ebebeb',
    //           fill: 0,
    //           strokeWidth: 1,
    //           selectable: false
    //       });
    //     }
    // }


    $(window).resize(function(){
        canvas.setWidth( $(window).width() - 20);
        canvas.setHeight( $(window).height() - 90 );
        canvas.calcOffset();
    });



    // canvas.on('object:moving', function(options) {
    //   options.target.set({
    //     left: Math.round(options.target.left / grid) * grid,
    //     top: Math.round(options.target.top / grid) * grid,
    //     opacity: 0.8
    //   });
    // });

    //save button
    $('#save_button').click(function(e){
        e.preventDefault();
        var canvasid = window.location.pathname.split('?')[0].split('/').filter(function (i) { return i !== ""}).slice(-1)[0];

        if( canvasid == "hexagons"){
            canvasid = '';
        }

        var data = {
            'user_id'       :   userid,
            'canvas_id'     :   canvasid,
            'canvas_data'   :   JSON.stringify(canvas)
        };

        $.ajax({
            url: baseurl + 'save',
            method: 'post',
            data: data,
            success:function(res, status, xhr){
                var obj = JSON.parse( res );
                console.log( obj );

                //append new id to url if a new save
                var url = window.location.pathname;
                if( !url.includes("formation") ){
                    window.history.replaceState(null, "Formation Saved!", 'formation/'+obj.id);
                }
            },
            error: function(res, status, xhr){
                console.log(status);
            }

        });
    });

    //add hex button
    $('#add_hex').click(function(){
        var path = new fabric.Path('M0 51.96152422706631L30 0L90 0L120 51.96152422706631L90 103.92304845413263L30 103.92304845413263Z');
        canvas.add(path);
        path.set({
            left: 0,
            top: 0,
            fill: 'red',
            hasControls: false,
            hasBorders: false,
            id: hex_id_counter
        });

        canvas.renderAll();

        var new_controls = $( getControlGroupString( hex_id_counter) ).appendTo('#controls').get(0);
        $('.colorwheel').colorwheel();

        path.on('moving', function() { positionCtl( canvas, path, new_controls) });

        positionCtl( canvas, path, new_controls);

        hex_id_counter += 1; //increment for next new hexagon

        $('.colorwheel_handle').click(function(e){
            e.preventDefault();
            $(this).prev('.colorwheel').fadeToggle(100);
        });
        $('.colorwheel').click(function(){
            console.log( '#' + $(this).colorwheel('value') );
            $(this).hide();
        });
    });





});
