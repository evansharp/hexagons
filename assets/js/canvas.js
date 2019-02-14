
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
    var hitTestOptions = {
        segments: true,
        stroke: false,
        fill: true,
        tolerance: 5
    };

    //select hexes and appropriate tool when hovering
    view.onMouseMove = function(event) {
        paper.project.activeLayer.selected = false;

        var hitResult = paper.project.hitTest(event.point, hitTestOptions);

        if (!hitResult){
            navTool.activate();
            return;
        }

        if (hitResult) {
            hexTool.activate();
            hitResult.item.selected = true;
        }
    }

    //when dragging a hex, the hexTool is already activated
    hexTool.onMouseDrag = function(event) {
        var hitResult = paper.project.hitTest(event.point, hitTestOptions);

        if (!hitResult)
            return;

        if (hitResult) {
    		targetHex = hitResult.item;
            paper.project.activeLayer.addChild(hitResult.item);

            //do the drag
            targetHex.position = event.point;

            //snap to others
            var allHexes = paper.project.activeLayer.children;

            for (var i = 0; i < allHexes.length; i++) {
                if( allHexes[i].id == targetHex.id)
                    continue;

                var intersections = targetHex.getIntersections( allHexes[i] );

            }

        }
    };

    //when dragging the canvas, the navTool is already activated
    navTool.onMouseDrag = function(event){
            var offset = event.downPoint.subtract( event.point );
            view.center = view.center.add(offset);

    };
    view.onDoubleClick = function(event) {
        view.center = view.size.divide(2);
    };

    // Zoom
    // $('#canvas').bind('mousewheel DOMMouseScroll MozMousePixelScroll', function(e) {
    //     var delta = 0;
    //     e.preventDefault();
    //     if (e.type == 'mousewheel') {       //this is for chrome/IE
    //         delta = e.originalEvent.wheelDelta;
    //     }
    //     else if (e.type == 'DOMMouseScroll') {  //this is for FireFox
    //         delta = e.originalEvent.detail*-1;  //FireFox reverses the scroll so we force to to re-reverse...
    //     }
    //     if (delta > 0) {   //scroll up
    //         var zoomCenter = e.point.subtract(paper.view.center);
    //
    //         var moveFactor = toolZoomIn.zoomFactor - 1.0;
    //         paper.view.zoom *= toolZoomIn.zoomFactor;
    //         paper.view.center = paper.view.center.add(zoomCenter.multiply(moveFactor/toolZoomIn.zoomFactor));
    //         toolZoomIn.hitTest(event);
    //         toolZoomIn.mode = '';
    //     }
    //     else if(delta < 0){ //scroll down
    //         //call the zoomOut here
    //     }
    // });
});
