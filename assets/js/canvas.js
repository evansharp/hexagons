
paper.install(window);
var zoomTool, hexTool, panTool, selectTool;

$(document).ready(function(){
    $('#c').css({   'width'     : '100%',
                    'height'    : (window.innerHeight - 89) + 'px' //subtract height of nav bar
                });


    var canvas = document.getElementById('c');
    paper.setup(canvas);

    zoomTool = new paper.Tool();
        zoomTool.zoomFactor = 1.1;
        zoomTool.moveFactor = 0.05;
    panTool = new paper.Tool();
    hexTool = new paper.Tool();
    selectTool = new paper.Tool();

    var hitTestOptions_drag = {
        segments: false,
        stroke: false,
        fill: true,
        tolerance: 5,
        match: function( t ){
            // only allow mouseover hit on the hex's body, in order to exclude controls
            if (t.item.name == 'hexbody'){
                return true;
            }else {
                return false;
            }

        }
    };
    var hitTestOptions_click = {
        segments: false,
        stroke: false,
        fill: true,
        tolerance: 5,
        match: function( t ){
            // only allow click to hit on the controls
            if (t.item.name == 'colorControl' || t.item.name == 'delControl' || t.item.name == 'textControl'){
                return true;
            }else {
                return false;
            }

        }
    };

    //select hexes and appropriate tool when hovering
    view.onMouseMove = function(event) {
        paper.project.activeLayer.selected = false;

        var hitResult = paper.project.hitTest(event.point, hitTestOptions_drag);

        if (!hitResult){
            //hide controls
            var groups = paper.project.getItems({
                name: 'hexgroup'
            });
            if( groups ){
                for(var f = 0; f < groups.length; f++){
                    var hidecolor = groups[f].children['hexbody'].fillColor;
                    groups[f].children['colorControl'].fillColor = hidecolor;
                    groups[f].children['delControl'].fillColor = hidecolor;
                    groups[f].children['textControl'].fillColor = hidecolor;
                }
            }
            //reset any styled cursors, unless a mod key is down
            if(!event.modifiers.alt || !event.modifiers.control){
                $('body').css('cursor', 'default');
            }
            return;
        }

        if (hitResult) {
            hexTool.activate();
            //show controls
            hexGroup = hitResult.item.parent;
            hexGroup.children['colorControl'].fillColor = '#333';
            hexGroup.children['delControl'].fillColor = '#333';
            hexGroup.children['textControl'].fillColor = '#333';

            //highlight the hexbody with a selection stroke
            hitResult.item.selected = true;
            //make the cursor make sense over the hex body
            $('body').css('cursor', 'move');
        }

        //make the cursor make sense over controls
        var hitResult = paper.project.hitTest(event.point, hitTestOptions_click);
        if (hitResult){
            $('body').css('cursor', 'pointer');
        }
    }

    //when dragging a hex, the hexTool is already activated
    hexTool.onMouseDrag = function(event) {
        var hitResult = paper.project.hitTest(event.point, hitTestOptions_drag);

        if (!hitResult)
            return;

        if (hitResult) {
    		targetHexGroup = hitResult.item.parent;
            paper.project.activeLayer.addChild( targetHexGroup );

            //do the drag ... on the hex group!
            targetHexGroup.position = event.point;
            //and the colorwheel
            $('.colorwheel[data-hex-id="' + hitResult.item.parent.id + '"]').css({
                "top" : (event.point.y - 50) + "px",
                "left": (event.point.x - 90) + "px"
            });

            //snap to others
            var allHexes = paper.project.activeLayer.children;

            for (var i = 0; i < allHexes.length; i++) {
                if( allHexes[i].id == targetHexGroup.id)
                    continue;


                var is = getIntersections(targetHexGroup.children['hexbody'], allHexes[i].children['hexbody']);

                for (var i = 0; i < is.length; i++) {
                    new Path.Circle({
                        center: is[i].point,
                        radius: 5,
                        fillColor: '#009dec'
                    }).removeOnDrag().removeOnMove();


                }
            }
        }
    };


    // pan tool is activated by the alt key already
    panTool.onMouseDrag = function(event){
        if (event.modifiers.alt){
            var offset = event.downPoint.subtract( event.point );
            view.center = view.center.add(offset);
        }
    };
    panTool.onMouseDown = function(event){
        if(event.modifiers.alt){
            $('body').css('cursor', 'grabbing');
        }
    };
    panTool.onMouseUp = function(event){
        if(event.modifiers.alt){
            $('body').css('cursor', 'grab');
        }else{
            $('body').css('cursor', 'default');
        }
    };
    // little helper to re-center the canvas
    view.onDoubleClick = function(event) {
        if (event.modifiers.alt) {
            view.center = view.size.divide(2);
        }
    };

    // Zoom
    $('#c').bind('mousewheel DOMMouseScroll MozMousePixelScroll', function(e) {
        if(e.ctrlKey == true){
            var delta = 0;
            e.preventDefault();
            if (e.type == 'mousewheel') {       //this is for chrome/IE
                delta = e.originalEvent.wheelDelta;
            }
            else if (e.type == 'DOMMouseScroll') {  //this is for FireFox
                delta = e.originalEvent.detail*-1;  //FireFox reverses the scroll so we force to to re-reverse...
            }
            if (delta > 0) {   //scroll up so zoom IN
                paper.view.zoom *= zoomTool.zoomFactor;
                if( paper.view.zoom > 1.5){
                    paper.view.zoom = 1.5;
                }

                var point = paper.DomEvent.getOffset(event, $('#c')[0]);
                point = paper.view.viewToProject( point );

                var zoomCenter = point.subtract(paper.view.center);

                paper.view.center = paper.view.center.add( zoomCenter.multiply( zoomTool.moveFactor ) );
            }
            else if(delta < 0){ //scroll down so zoom OUT
                paper.view.zoom /= zoomTool.zoomFactor;
                console.log(paper.view.zoom);
                if( paper.view.zoom < 0.50){
                   paper.view.zoom = 0.50;
                }

                var point = paper.DomEvent.getOffset(event, $('#c')[0]);
                point = paper.view.viewToProject( point );

                var zoomCenter = point.subtract(paper.view.center);
                paper.view.center = paper.view.center.subtract( zoomCenter.multiply( zoomTool.moveFactor ) );

            }
        }
    });

    // color wheel, delete, and label controls
    hexTool.onMouseUp = function(event){
        var hitResult = paper.project.hitTest(event.point, hitTestOptions_click);
        if (!hitResult)
            return;

        if (hitResult) {
            if(hitResult.item.name == 'colorControl'){
                $('.colorwheel[data-hex-id="' + hitResult.item.parent.id + '"]').fadeToggle(100);

            }else if(hitResult.item.name == 'delControl'){
                hitResult.item.parent.remove();
                hitResult.item.parent.clear();

            }else if(hitResult.item.name == 'textControl'){
                var old_label_content = hitResult.item.parent.children['label'].content;
                var hexLabel_id = hitResult.item.parent.children['label'].id;
                //dialog
                $('#label_modal input').val( old_label_content );
                $('#edit_label_id').html( hexLabel_id );
                $('#label_modal').modal('open');
            }

        }
    };

});
