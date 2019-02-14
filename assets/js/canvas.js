
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

    //select hexes and appropriate tool when hovering
    view.onMouseMove = function(event) {
        paper.project.activeLayer.selected = false;
        hexagons = paper.project.activeLayer.children;
        
        // hit test to see which hex we have
        // activate tool depending on outcome
        if (hexagons.length > 0) {
            for (var ix = 0; ix < hexagons.length; ix++) {
                if ( hexagons[ix].contains( event.point ) ) {
                    console.log('hit');
                    hexTool.activate();
                    hexagons[ix].selected = true;
                    break;
                }else{
                    navTool.activate();
                    break;
                }
            }
        }
    }

    //when dragging a hex, the hexTool is already activated
    hexTool.onMouseDrag = function(event) {
        var targetIndex = -1;
        var hexagons = paper.project.activeLayer.children;

        // hit test to see which hex we have
        if (hexagons.length > 0) {
            for (var ix = 0; ix < hexagons.length; ix++) {
                if (hexagons[ix].contains( event.point )) {
                    targetIndex = ix;
                    break;
                }
            }
        }

        //do the drag
        if (targetIndex > -1) {

            hexagons[targetIndex].position = event.point;

            //snap to others
            for (var i = 0; i < hexagons.length; i++) {
                if( i == targetIndex){
                    continue;
                }

                var intersections = hexagons[targetIndex].getIntersections( hexagons[i] );
                console.log(intersections);

                // if(intersections){
                //     for (var i = 0; i < intersections.length; i++) {
                //         new paper.Path.Circle({
                //             center: intersections[i].point,
                //             radius: 5,
                //             fillColor: '#000'
                //         }).removeOnMove();
                //         paper.view.draw();
                //     }
                // }
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
