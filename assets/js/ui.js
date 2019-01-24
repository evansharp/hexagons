



function loading(){
    var i = M.Modal.getInstance( document.querySelector('#loader_modal') );
    i.open();
}

$(document).ready(function(){

    //init mterialize components
    $('.dropdown-trigger').dropdown();
    $('.fixed-action-btn').floatingActionButton();
    $('select').formSelect();
    $('.tooltipped').tooltip();
    $('.modal').modal();

    var canvas = new fabric.Canvas('c',{
        height:	window.innerHeight-80,
        width: window.innerWidth-10
    });
    var grid = 120;
    var grids = 104;

	var gridLen = canvas.width / grid;
    var gridhieght = canvas.height / grids;

    for (var a = 0; a < gridhieght; a++){
        for (var i = 0; i < gridLen; i++) {
          var path = new fabric.Path('M0 51.96152422706631L30 0L90 0L120 51.96152422706631L90 103.92304845413263L30 103.92304845413263Z');
          canvas.add(path);
          path.set({
              left: i * grid,
              top: a * grids,
              stroke: '#ebebeb',
              strokeWidth: 1,
              selectable: false
          });
        }
    }


    $(window).resize(function(){
        canvas.setWidth( $(window).width() - 10);
        canvas.setHeight( $(window).height()-80 );
        canvas.calcOffset();
    });



    canvas.on('object:moving', function(options) {
      options.target.set({
        left: Math.round(options.target.left / grid) * grid,
        top: Math.round(options.target.top / grid) * grid,
        opacity: 0.8
      });
    });

    //add hex button
    $('#add_hex').click(function(){
        var path = new fabric.Path('M0 51.96152422706631L30 0L90 0L120 51.96152422706631L90 103.92304845413263L30 103.92304845413263Z');
        canvas.add(path);
        path.set({
            left: 0,
            top: 0,
            fill: 'red',
            hasControls: false,
            hasBorders: false
        });
        canvas.renderAll();
    });

});
