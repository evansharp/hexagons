
paper.install(window);
var navTool, hexTool;

$(document).ready(function(){
    $(window).resize(function(){
        $('#c').css({   'width': '100%',
                        'height': '100%'
                    });
    });

    var canvas = document.getElementById('c');
    paper.setup(canvas);

    navTool = new paper.Tool();
    hexTool = new paper.Tool();
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
            if (t.item.name == 'colorControl' || t.item.name == 'delControl' || t.item.name == 'label'){
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
            navTool.activate();
            //reset any styled cursors
            $('body').css('cursor', 'default');
            return;
        }

        if (hitResult) {
            hexTool.activate();
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
            // var allHexes = paper.project.activeLayer.children;
            //
            // for (var i = 0; i < allHexes.length; i++) {
            //     if( allHexes[i].id == targetHex.id)
            //         continue;
            //
            //     var intersections = targetHex.getIntersections( allHexes[i] );
            //
            // }
        }
    };

    //when dragging the canvas, the navTool is already activated
    navTool.onMouseDrag = function(event){
        if (event.modifiers.alt) {
            var offset = event.downPoint.subtract( event.point );
            view.center = view.center.add(offset);
        }

    };
    // little helper to re-center the canvas
    view.onDoubleClick = function(event) {
        if (event.modifiers.alt) {
            view.center = view.size.divide(2);
        }
    };

    // Zoom
    // $('#c').bind('mousewheel DOMMouseScroll MozMousePixelScroll', function(e) {
    //
    //     var delta = 0;
    //     e.preventDefault();
    //     if (e.type == 'mousewheel') {       //this is for chrome/IE
    //         delta = e.originalEvent.wheelDelta;
    //     }
    //     else if (e.type == 'DOMMouseScroll') {  //this is for FireFox
    //         delta = e.originalEvent.detail*-1;  //FireFox reverses the scroll so we force to to re-reverse...
    //     }
    //     if (delta > 0) {   //scroll up
    //         var point = paper.DomEvent.getOffset(event, $('#c')[0]);
    //         point = paper.view.viewToProject(point);
    //
    //         var zoomCenter = point.subtract(paper.view.center);
    //
    //         var moveFactor = toolZoomIn.zoomFactor - 1.0;
    //         console.log(toolZoomIn.zoomFactor);
    //         // paper.view.zoom *= toolZoomIn.zoomFactor;
    //         // paper.view.center = paper.view.center.add(zoomCenter.multiply(moveFactor/toolZoomIn.zoomFactor));
    //         // toolZoomIn.hitTest(event);
    //         // toolZoomIn.mode = '';
    //     }
    //     else if(delta < 0){ //scroll down
    //         //call the zoomOut here
    //     }
    //});

    // color wheel, delete, and label controls
    hexTool.onMouseUp = function(event){
        var hitResult = paper.project.hitTest(event.point, hitTestOptions_click);
        if (!hitResult)
            return;

        if (hitResult) {
            if(hitResult.item.name == 'colorControl'){
                //console.log('color: ' + hitResult.item.parent.id);

                $('.colorwheel[data-hex-id="' + hitResult.item.parent.id + '"]').fadeToggle(100);

            }else if(hitResult.item.name == 'delControl'){
                //console.log('del: ' + hitResult.item.parent.id);

                hitResult.item.parent.remove();
                hitResult.item.parent.clear();

            }else if(hitResult.item.name == 'label'){

            }

        }
    };

});
