
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
                if (hexagons[ix].contains( event.point )) {
                    console.log( 'activate hex tools' );

                    hexTool.activate();
                    hexagons[ix].selected = true;

                    break;
                }else{
                    console.log( 'activate nav tools' );
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

            for (var i = 0; i < hexagons.length; i++) {
                if( i == targetIndex)
                    continue;

                //var intersections = hexagons[i].getIntersections( hexagons[targetIndex] );

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

    //when dragging the canvas, the panTool is already activated
    navTool.onMouseDrag = function(event){
            console.log(event);
            var offset = event.downPoint - event.point;
            console.log(view.center);
            //view.center += offset;

    };
    view.onDoubleClick = function(event) {
        view.center = view.size/2;
    };
});
