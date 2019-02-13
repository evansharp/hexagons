
paper.install(window);

$(document).ready(function(){


    $(window).resize(function(){
        $('#c').css({   'width': '100%',
                        'height': '100%'
                    });
    });

    var canvas = document.getElementById('c');
    paper.setup(canvas);

    view.onMouseMove = function(event) {
        paper.project.activeLayer.selected = false;
    	if (event.item)
    		event.item.selected = true;
    }

    view.onMouseDrag = function(event) {
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
                console.log(i);
                if( i == targetIndex)
                    continue;

                var intersections = hexagons[i].getIntersections( hexagons[targetIndex] );

                if(intersections){
                    for (var i = 0; i < intersections.length; i++) {
                        new paper.Path.Circle({
                            center: intersections[i].point,
                            radius: 5,
                            fillColor: '#000'
                        });
                    }
                }
            }
        }
    };
});
