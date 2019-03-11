$(document).ready(function(){
    //init mterialize components
    M.AutoInit();

    //init title editor with callback
    M.Modal.init(document.querySelectorAll('#title_modal'), {
        onOpenEnd: function(){
            $('#title_modal input').focus();
        },
        onCloseStart: function(){
            $('#formation_title > span').html( $('#title_modal input').val() );
        }
    });

    //init hex label editor with callback
    M.Modal.init(document.querySelectorAll('#label_modal'), {
        onOpenEnd: function(){
            $('#label_modal input').focus();
        },
        onCloseStart: function(){
            paper.project.getItems({ id: parseInt( $('#edit_label_id').html() ) })[0].content = $('#label_modal input').val();
        }
    });
    //show a warning when char limit is reached
    $('#label_modal input').keyup(function(){
        var num_char = $(this).val().length;
        if(num_char == 25){
            $(this).siblings('.maxlength_notice').css('color', 'red');
        }else{
            $(this).siblings('.maxlength_notice').css('color', 'transparent');
        }
    });

    //we are loading a canvas based on URL hash
    //a JSON serialization of the canvas is in canvasData
    if( canvasData ){
        paper.project.importJSON(canvasData);

        //add color wheels for extant Hexagons
        var allHexes = paper.project.activeLayer.children;

        for (var i = 0; i < allHexes.length; i++) {
            var hexGroup = allHexes[i];

            $('<div class="colorwheel" data-hex-id="' + hexGroup.id + '"></div>').css({
                                                    "top" : (hexGroup.position.y - 50) + "px",
                                                    "left" : (hexGroup.position.x - 90) + "px",
                                                }).appendTo('#colorwheel_bin');
        }
        $('.colorwheel').colorwheel();

        //when a colour is picked and apply to target hex
        $('.colorwheel').click(function(e){
            e.preventDefault();
            $(this).fadeOut(100); //hide colorwheel

            var picked = $(this).colorwheel('value');
            var targetId = $(this).attr('data-hex-id');

            //set hex color to picked color
            var hexGroup = paper.project.getItem( {id: parseInt(targetId) } );
            hexGroup.children['hexbody'].fillColor = '#' + picked;
            paper.view.draw();
        });

        //loaded from temp client session post-login, prompt user to save
        if( sessionStorage.getItem("canvasData") ){
            M.toast({html: "Logged in! <br> Don't forget to save your work." });
        }

        //remove any data leftover from logging in
        sessionStorage.clear();

    }

    // save canvas on client when logging-in so work is not lost
    $('#loginlink').on("click", function (e) {
        $('#loading_modal').modal('open');

        var canvasid = window.location.pathname.split('?')[0].split('/').filter(function (i) { return i !== ""}).slice(-1)[0];

        sessionStorage.setItem('canvasData', paper.project.exportJSON());
        sessionStorage.setItem('canvasTitle', $('#formation_title').children('span').text() );
        if( canvasid != "hexagons"){
            sessionStorage.setItem('formationURL', canvasid);
        }
    });


    //save button
    $('#save_button').click(function(e){
        e.preventDefault();
        $('#loading_modal').modal('open');

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
        $('#loading_modal').modal('open');
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
                console.log(res);
                var obj = JSON.parse( res );
                console.log( obj );
                M.toast({html: obj.msg });
            }
        });
    });

    //add hex button
    $('#add_hex').click(function(){
        var init_color = '#ccc';

        var hexagon = new paper.Path.RegularPolygon(new paper.Point(200, 70), 6, 60);
        hexagon.fillColor = init_color;
        hexagon.strokeColor = new Color(1, 0, 0);
        hexagon.strokeWidth = 0;
        hexagon.rotation = 30;
        hexagon.selectedColor = new Color(1, 0, 0);
        hexagon.name = 'hexbody';

        var colorPath = 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5';
        var colorControl = new paper.CompoundPath(colorPath);
        colorControl.fillColor = init_color;
        colorControl.position = new paper.Point(180, 32);
        colorControl.name = 'colorControl';


        var delControl = new paper.CompoundPath('M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z');
        delControl.fillColor = init_color;
        delControl.position = new paper.Point(200, 32);
        delControl.name = 'delControl';

        var textControl = new paper.CompoundPath('M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z');
        textControl.fillColor = init_color;
        textControl.position = new paper.Point(220, 32);
        textControl.name = 'textControl';

        var label = new paper.PointText({
            point: [202, 74],
            name: 'label',
            content: '',
            fillColor: '#333',
            fontFamily: 'Lato',
            fontSize: 15,
            justification: 'center'
        });

        var hexGroup = new paper.Group( [hexagon, colorControl, delControl, textControl, label] );
        hexGroup.position = view.center;
        hexGroup.name = "hexgroup";
        hexGroup.data.multiselected = false;

    	paper.view.draw();

        // init just-added color wheel controls
        $('<div class="colorwheel" data-hex-id="' + hexGroup.id + '"></div>').css({
                                                "top" : (hexGroup.position.y - 50) + "px",
                                                "left" : (hexGroup.position.x - 90) + "px",
                                            }).appendTo('#colorwheel_bin');


        $('.colorwheel').colorwheel();

        //when a colour is picked and apply to target hex
        $('.colorwheel').click(function(e){
            e.preventDefault();
            $(this).fadeOut(100); //hide colorwheel

            var picked = $(this).colorwheel('value');
            var targetId = $(this).attr('data-hex-id');

            //set hex color to picked color
            var hexGroup = paper.project.getItem( {id: parseInt(targetId) } );
            hexGroup.children['hexbody'].fillColor = '#' + picked;
            hexGroup.children['colorControl'].fillColor = '#' + picked;
            hexGroup.children['delControl'].fillColor = '#' + picked;
            hexGroup.children['textControl'].fillColor = '#' + picked;

            paper.view.draw();
        });
    });

    //edit title
    $('#formation_title').click(function(){
        $('#title_modal input').val( $(this).children('span').text() );
        $('#title_modal').modal('open');
    });

    //infomrational modals
    $('#about_link').click(function(){
        $('#about_modal').modal('open');
    });
    $('#policy_link').click(function(){
        $('#policy_modal').modal('open');
    });

    //give user instructions
    if( !getCookie('instructions') ){
        M.toast({html: "ctrl + mousewheel to zoom. <br> alt + drag to pan. <br> shift + click to select multiple" });
        setCookie('instructions', 'true', 1);
    }

    //warn user before leaving
    window.onbeforeunload = function(){
        //return 'Are you sure you want to leave this formation without saving?';
    };


});
