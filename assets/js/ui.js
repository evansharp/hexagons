
function loading(){
    var i = M.Modal.getInstance( document.querySelector('#loader_modal') );
    i.open();
}

$(document).ready(function(){

    //init mterialize components
    $('.dropdown-trigger').dropdown();
    $('.fixed-action-btn').floatingActionButton();
    $('select').formSelect();
    $('.tooltipped').tooltip();
    $('.modal').modal();

    var canvas = new fabric.Canvas('c',{
        height:	window.innerHeight-80,
        width: window.innerWidth-10
    });

    if( canvasData ){
        //process canvas objects to add settings not exported properly
        var rough_canvas = JSON.parse( canvasData );
        $.each(rough_canvas.objects, function(i, canvas_item){
            canvas_item.hasBorders = false;
            canvas_item.hasControls = false;
            canvas_item.hasRotatingPoint = false;
        });
        console.log(rough_canvas);
        //stupid Fabric JS won't import an object...
        var fine_canvas = JSON.stringify( rough_canvas );

        canvas.loadFromJSON( fine_canvas );
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
        canvas.setWidth( $(window).width() - 10);
        canvas.setHeight( $(window).height()-80 );
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
            hasBorders: false
        });
        canvas.renderAll();
        var controlGroup = '<div class="hex_controls">
                                <i class="material-icons">delete</i>
                                <i class="material-icons">text_fields</i>';
        $(controlGroup).append('#controls');
    });

});
