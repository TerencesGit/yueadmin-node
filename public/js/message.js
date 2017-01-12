//留言删除
var btnDelete = $('.btn-delete');
btnDelete.on('click', function(e){
  if(confirm('是否删除该条留言？')){
     var id = $(this).attr('data-id');
    var $media = $(this).parents('.media');
    $.ajax({
      type: 'get',
      url: '/message/delete/?id='+ id,
    })
    .done(function(res){
      if(res.status == 1){
        if($media.length === 1){
          $media.remove()
        }
      }
    })
  }else{
    return false;
  }
})