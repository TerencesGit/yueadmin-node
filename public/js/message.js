//留言删除
var btnDelete = $('.btn-delete');
btnDelete.on('click', function(e){
  var id = $(this).attr('data-id');
  var $media = $(this).parents('.media');
  $.dialog().confirm({message: '是否删除该条留言？'})
   .on('confirm', function(){
    messageDel(id, $media)
   })
})
function messageDel(id, $media){
  $.ajax({
    type: 'get',
    url: '/message/delete/?id='+ id,
  })
  .done(function(res){
    if(res.status == 1){
      if($media.length === 1){
        $.dialog().success({message: '删除成功', delay: 1000})
        $media.remove()
      }
    }
  })
}