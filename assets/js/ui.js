// provide incremental temp id for hex objects
var hex_id_counter = 0;

//an init function for listeners
function attachListeners(){
    // init just-added color wheel controls
    $('.colorwheel').colorwheel();

    $('.colorwheel_handle').click(function(e){
        e.preventDefault();
        $(this).prev('.colorwheel').fadeToggle(100);
    });

    //when a colour is picked and apply to target hex
    $('.colorwheel').click(function(e){
        e.preventDefault();
        $(this).fadeOut(100); //hide colorwheel

        var picked = $(this).colorwheel('value');

        //set hex color to picked color



    });

    //when a trashcan is kicked...
    $('.trashcan').click(function(e){
        e.preventDefault();

        //destroy hex item and controls
    });

    //click labelmaker
    $('.labelmaker').click(function(e){
        e.preventDefault();

        var id = $(this).parent('.hex_controls').attr('data-hex-id');
        var labelhtml = '<input type="text" class="hex_label" data-hex-id="' + id + '" >';

        // add an input to the path?

    });

}



function getControlGroupString(id){
    return '<div class="hex_controls" data-hex-id="' + id + '">' +
                '<div class="colorwheel"></div>'+
                '<a href="" class="hex_control colorwheel_handle"><i class="material-icons">color_lens</i></a>'+
                '<a href="" class="hex_control trashcan"><i class="material-icons">delete</i></a>'+
                '<a href="" class="hex_control labelmaker"><i class="material-icons">text_fields</i></a>'+
            '</div>';
}

$(document).ready(function(){
    //init mterialize components
    M.AutoInit();

    //init title editor with callback
    M.Modal.init(document.querySelectorAll('#title_modal'), {
        onCloseStart: function(){
            $('#formation_title > span').html( $('#title_modal input').val() );
        }
    });

    //we are leading a canvas based on URL hash
    //a JSON serialization of the canvas is in canvasData
    if( canvasData ){

    }

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
            'canvas_data'   :   null,
            'title'         :   $('#formation_title span').text()
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

                M.toast({html: obj.msg });
            },
            error: function(res, status, xhr){
                var obj = JSON.parse( res );
                console.log( obj );
                M.toast({html: obj.msg });
            }

        });
    });

    //delete button
    $('#delete_button').click(function(e){
        e.preventDefault();
        var canvasid = window.location.pathname.split('?')[0].split('/').filter(function (i) { return i !== ""}).slice(-1)[0];

        if( canvasid == "hexagons"){
            return false;
        }

        var data = {
            'user_id'       :   userid,
            'canvas_id'     :   canvasid
        };

        $.ajax({
            url: baseurl + 'delete',
            method: 'post',
            data: data,
            success:function(res, status, xhr){
                var obj = JSON.parse( res );
                if( obj.success ){
                    window.location.replace(baseurl);
                }
            },
            error: function(res, status, xhr){
                var obj = JSON.parse( res );
                console.log( obj );
                M.toast({html: obj.msg });
            }
        });
    });


    //duplicate button
    $('#duplicate_button').click(function(e){
        e.preventDefault();
        var canvasid = window.location.pathname.split('?')[0].split('/').filter(function (i) { return i !== ""}).slice(-1)[0];

        if( canvasid == "hexagons"){
            return false;
        }

        var data = {
            'user_id'       :   userid,
            'canvas_id'     :   canvasid,
            'canvas_data'   :   null,
            'title'         :   $('#formation_title span').text()
        };

        $.ajax({
            url: baseurl + 'duplicate',
            method: 'post',
            data: data,
            success:function(res, status, xhr){
                var obj = JSON.parse( res );
                if( obj.success ){
                    //flashdata for ui notfication set in Canvas controller
                    window.location.replace( baseurl + 'formation/' + obj.id );
                }
            },
            error: function(res, status, xhr){
                var obj = JSON.parse( res );
                console.log( obj );
                M.toast({html: obj.msg });
            }
        });
    });

    //add hex button
    $('#add_hex').click(function(){
        //var path = new fabric.Path('M0 51.96152422706631L30 0L90 0L120 51.96152422706631L90 103.92304845413263L30 103.92304845413263Z');


    		var path = new paper.Path();
    		// Give the stroke a color
    		path.strokeColor = 'black';
    		var start = new paper.Point(100, 100);
    		// Move to start and draw a line from there
    		path.moveTo(start);
    		// Note that the plus operator on Point objects does not work
    		// in JavaScript. Instead, we need to call the add() function:
    		path.lineTo(start.add([ 200, -50 ]));
    		// Draw the view now:
    		paper.view.draw();
        // canvas.add(path);
        // path.set({
        //     right: 50,
        //     top: 50,
        //     fill: 'red',
        //     hasControls: false,
        //     hasBorders: false,
        //     id: hex_id_counter
        // });


        hex_id_counter += 1; //increment for next new hexagon
    });

    //edit title
    $('#formation_title').click(function(){
        $('#title_modal input').val( $(this).children('span').text() );
        $('#title_modal').modal('open');
    });
});
