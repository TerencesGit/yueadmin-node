//* 用户管理 */
var $btnDelete = $('.btn-del'),
    $btnEdit = $('.btn-edit');

//用户信息编辑
$btnEdit.on('click', function(){
  var $tr = $(this).parents('tr');
  console.log($tr)
  var uid = $tr.attr('data-id');
      name = $tr.children('.name').text(),
      email = $tr.children('.email').text(),
      role = $tr.children('.role').text();
  var $modal = $('#myModal'),
      IdInput = $modal.find('#uid'),
      nameInput = $modal.find('.username'),
      emailInput = $modal.find('.email'),
      roleInput = $modal.find('.role');
  IdInput.val(uid);
  nameInput.val(name);
  emailInput.val(email);
  roleInput.val(role);
})

//用户删除
$btnDelete.on('click', function(){
	var $tr = $(this).parents('tr');
	var name = $tr.children().eq(0).text();
	var uid = $tr.attr('data-id');
  $.dialog({type: 'confirm', message: '确定删除用户'+name, 
    handlerConfirm: function(){ confirmDel() }, handlerCancel: function(){return false}})
  function confirmDel(){
    $.ajax({
      url: '/user/delete',
      data: {uid: uid},
      beforeSend: function(){
        //var waiting = $.dialog({type: 'waiting',delay: 1000})
      }
    })
    .done(function(res) {
      console.log(res.status);
      if(res.status == 1){
        if($tr.length === 1){
          $.dialog({type: 'success', message: '删除成功',delay: 1000})
          $tr.remove()
        }
      }
    })
    .fail(function(error) {
      console.log(error);
    })
  }
})