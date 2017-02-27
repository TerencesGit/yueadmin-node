//* 用户管理 */
var $btnDelete = $('.btn-del'),
    $btnEdit = $('.btn-edit');
const btnDelete = $('.btn-del');
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

//账户删除
btnDelete.on('click', function(){
  const $tr = $(this).parents('tr');
  const uid = $tr.data('id');
  const account = $tr.children('.account').text();
  $.dialog().confirm({message: '确定删除账号<a>'+account+'</a>，此操作不可恢复'})
   .on('confirm', function(){
      removeAccount(uid, $tr)
  })
})
function removeAccount(uid, $tr){
    $.ajax({
      url: '/system/remove_account?id=' + uid,
    })
    .done(function(res) {
      console.log(res.status);
      if(res.status == 1){
        if($tr.length === 1){
          $.dialog().success({message: '删除成功',delay: 600})
          setTimeout(function(){
            $tr.remove()
          }, 700)
        }
      }
    })
    .fail(function(error) {
      console.log(error);
    })
  }