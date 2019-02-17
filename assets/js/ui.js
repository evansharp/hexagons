//an init function for listeners
function attachListeners( id ){
    // init just-added color wheel controls
    $('#colorwheel_bin').append('<div class="colorwheel" data-hex-id="' + id + '"></div>');
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
                '<div class="colorwheel" data-hex-id="' + id + '"></div>'+
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

    //we are loading a canvas based on URL hash
    //a JSON serialization of the canvas is in canvasData
    if( canvasData ){
        paper.project.importJSON(canvasData);
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
            'canvas_data'   :   paper.project.exportJSON(),
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
            'canvas_data'   :   paper.project.exportJSON(),
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

        var hexagon = new paper.Path.RegularPolygon(new paper.Point(200, 70), 6, 60);
        hexagon.fillColor = '#e9e9ff';
        hexagon.rotation = 30;
        hexagon.selectedColor = new Color(1, 0, 0);
        hexagon.name = 'hexbody';

        var colorControl = new paper.Path('M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z');
        colorControl.fillColor = '#000000';
        colorControl.position = new paper.Point(180, 32);
        colorControl.name = 'colorControl';


        var delControl = new paper.Path('M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z');
        delControl.fillColor = '#000000';
        delControl.position = new paper.Point(205, 32);
        delControl.name = 'delControl';

        var label = null;

        var hexGroup = new paper.Group( [hexagon, colorControl, delControl, label] );
        hexGroup.position = new paper.Point(100, 120);
        hexGroup.name = "hexgroup";

    	paper.view.draw();

        attachListeners(hexGroup.id);
    });

    //edit title
    $('#formation_title').click(function(){
        $('#title_modal input').val( $(this).children('span').text() );
        $('#title_modal').modal('open');
    });
});
