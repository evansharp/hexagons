paper.install(window);
var zoomTool, hexTool, panTool, selectTool, selectionGroup;

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

function highlight_selected( hexgroup, yepnope ){
    if(yepnope){
        hexgroup.children['hexbody'].strokeWidth = 1;
    }else{
        hexgroup.children['hexbody'].strokeWidth = 0;
    }
}
function update_selectionGroup(){
    var preserve = selectionGroup.removeChildren()
    for (var i = 0; i < preserve.length; i++) {
        paper.project.activeLayer.addChild( preserve[i] );
    }
    selectionGroup.addChildren( selectTool.selected );
}


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
        selectTool.selected = [];

    selectionGroup = new paper.Group();
    selectionGroup.name = 'selectionGroup';

    //select hexes and appropriate tool when hovering
    view.onMouseMove = function(event) {
        var hitResult = paper.project.hitTest(event.point, hitTestOptions_drag);

        if (!hitResult){
            //hide controls
            var groups = paper.project.getItems({ name: 'hexgroup' });
            if( groups ){
                for(var f = 0; f < groups.length; f++){
                    var hidecolor = groups[f].children['hexbody'].fillColor;
                    groups[f].children['colorControl'].fillColor = hidecolor;
                    groups[f].children['delControl'].fillColor = hidecolor;
                    groups[f].children['textControl'].fillColor = hidecolor;

                    //unstroke (hover indicator) Hexagons if no multiselect
                    if( !groups[f].data.multiselected ){
                        highlight_selected( groups[f], false );
                    }

                }
            }
            //reset any styled cursors, unless a mod key is down
            if(!event.modifiers.alt && !event.modifiers.control){
                $('body').css('cursor', 'default');
            }
            return;
        }

        if (hitResult && !event.modifiers.shift) {
            hexTool.activate();
            //show controls
            hexGroup = hitResult.item.parent;
            hexGroup.children['colorControl'].fillColor = '#222';
            hexGroup.children['delControl'].fillColor = '#222';
            hexGroup.children['textControl'].fillColor = '#222';

            //highlight the hexbody with a stroke
            highlight_selected(hexGroup, true);

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


            //do the drag on the individual hex group or selectionGroup
            if( selectionGroup.children.length > 0 && selectionGroup.isAncestor( targetHexGroup ) ){
                paper.project.activeLayer.addChild( selectionGroup );
                selectionGroup.position = selectionGroup.position.add( event.point ).subtract( event.lastPoint );

            }else{
                paper.project.activeLayer.addChild( targetHexGroup );
                targetHexGroup.position = targetHexGroup.position.add( event.point ).subtract( event.lastPoint );
            }

            //and the colorwheel
            $('.colorwheel[data-hex-id="' + hitResult.item.parent.id + '"]').css({
                "top" : (targetHexGroup.position.y - 50) + "px",
                "left": (targetHexGroup.position.x - 90) + "px"
            });

            //snap to others
            //var allHexes = paper.project.activeLayer.children;
            //
            // for (var i = 0; i < allHexes.length; i++) {
            //     if( allHexes[i].id == targetHexGroup.id)
            //         continue;
            //
            //
            //     var is = []; //getIntersections(targetHexGroup.children['hexbody'], allHexes[i].children['hexbody']);
            //
            //     for (var i = 0; i < is.length; i++) {
            //         new Path.Circle({
            //             center: is[i].point,
            //             radius: 5,
            //             fillColor: '#009dec'
            //         }).removeOnDrag().removeOnMove();
            //
            //
            //     }
            // }
        }
        // var hitResult = paper.project.hitTest(event.point, hitTestOptions_multigroup);
        // if (hitResult) {
    	// 	group = hitResult.item.parent;
        //
        //     paper.project.activeLayer.addChild( group );
        //
        //     //do the drag on the hex group
        //     group.position = group.position.add( event.point ).subtract( event.lastPoint );
        // }
    };

    //------------- toggle tools with mod keys -----------------------
    //change cursor on alt key for pan & zoom
    $(window).bind('keydown', function(e){
        if(e.which == 18){
            //if alt, we're panning
            $('body').css('cursor', 'grab');
            panTool.activate();
        }else if(e.which == 17){
            //if ctrl, we're zooming
            $('body').css('cursor', 'zoom-in');
            zoomTool.activate();
        }else if(e.which == 16){
            //if shift, we're multi-selcting
            selectTool.activate();
        }
    });
    $(window).bind('keyup', function(e){
        if(e.which == 18 || e.which == 17){
            $('body').css('cursor', 'default');
        }
    });

    // ------------ pan tool is activated by the alt key already -----------
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
    view.onDoubleClick = function(event){
        if (event.modifiers.alt) {
            view.center = view.size.divide( 2 );
        }
    };
    // de-select multi-selected hexes with single click on blank canvas
    view.onMouseDown = function(event){
        if (!event.modifiers.shift) {
            var hitResult = paper.project.hitTest(event.point, hitTestOptions_drag); //use dragOptions so controls are exclude
            //hit test only succeeds on blank canvas
            if(!hitResult){
                var groups = paper.project.getItems({ name: 'hexgroup' });
                if( groups ){
                    for(var f = 0; f < groups.length; f++){
                        groups[f].data.multiselected = false;
                        highlight_selected(groups[f], false);

                        //empty tool prop and selectionGroup
                        selectTool.selected = [];
                        update_selectionGroup();

                    }
                }
            }
        }
    }

    // do individual hex multi-select
    selectTool.onMouseDown = function(event){
        if (event.modifiers.shift) {
            var hitResult = paper.project.hitTest(event.point, hitTestOptions_drag); //use dragOptions so controls are excluded
            if(hitResult){
                var targetHexGroup = hitResult.item.parent;
                if( targetHexGroup.data.multiselected ){
                    targetHexGroup.data.multiselected = false;
                    selectTool.selected = selectTool.selected.filter(function(v, i, arr){
                        return v.data.multiselected == true;
                    });
                    highlight_selected(targetHexGroup, false);
                }else{
                    targetHexGroup.data.multiselected = true;
                    selectTool.selected.push( targetHexGroup );
                    highlight_selected(targetHexGroup, true);
                }
            }


            //update members against tool property
            update_selectionGroup();

            console.log(selectionGroup.children)
        }
    }

    selectTool.onMouseDrag = function(event){
        if (event.modifiers.shift) {

            //draw selection box
            var startCorner = event.downPoint;
            var selectBox = new paper.Path.Rectangle(startCorner, 1);
            selectBox.fillColor = '#e9e9ff',
            selectBox.strokeColor = '#80C2F4';
            selectBox.strokeWidth = 1;
            selectBox.name = 'selectbox';


        }
    }
    selectTool.onMouseUp = function(event){
        var boxes = paper.project.getItems({ name: 'selectbox' });
        if( boxes ){
            for(var f = 0; f < boxes.length; f++){
                boxes[f].remove();
            }
        }
    }


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
