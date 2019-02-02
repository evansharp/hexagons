$(document).ready(function(){
    //init mterialize components
    M.AutoInit();
});

//delete canvas from list button
$('.delete_from_list_button').click(function(e){
    e.preventDefault();

    $.ajax({
        url: baseurl + 'delete',
        method: 'post',
        data: {
            canvas_id: $(this).attr('data-canvas-id'),
            user_id: userid
        },
        success:function(res, status, xhr){
            var obj = JSON.parse( res );
            console.log( obj );
            if( obj.success ){
                $( e.target ).parents('tr').slideUp(500, function(){ $(this).remove(); });
            }
            M.toast({html: obj.msg });
        },
        error: function(res, status, xhr){
            var obj = JSON.parse( res );
            console.log( obj );
            M.toast({html: 'Sever Communication Error' });
        }

    });
});
