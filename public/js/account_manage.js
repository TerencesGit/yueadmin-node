/** 账户管理 **/
//账户表格
const accountDataTable = $('#accountDataTable');
$(function(){
  accountDataTable.length === 1 &&& accountDataTable.DataTable()
})
//获取点击按钮所在行的数据      
function getRowData($target){
  const $tr = $target.parents('tr');
  const id = $tr.data('id'),
        account = $tr.children('.account').text(),
        name = $tr.children('.name').text();
  return {id: id, account: account, name: name};
}
//设置状态按钮
const btnStatus = $('.btn-status');
//设置账户状态 
btnStatus.on('click', function(e){
  const _this = $(this);
  const status = $(this).attr('data-status');
  const account = getRowData($(this)).account;
  const accountId = getRowData($(this)).id;
  let statu = status == 0 ? 1 : 0;
  let info = status == 0 ? '启用状态' : '禁用状态';
  $.dialog().confirm({message: '确定将账户 <a>'+ account+ '</a> 设置为'+info})
   .on('confirm', function(){
      setAccountStatus(accountId, statu, _this)
   })
})
function setAccountStatus(id, status, target){
  $.ajax({
    url: '/system/set_account_status?id='+id+'&&status='+status,
    type: 'GET',
  })
  .done(function(res) {
    if(res.status == 1){
      $.dialog().success({message: '设置成功', delay: 600})
      setTimeout(function(){
        let title = status == 0 ? '禁用状态' : '启用状态';
        if(status == 0){
          target.attr('title', title).attr('data-status', 0).children('.fa')
                .removeClass('fa-toggle-on').addClass('fa-toggle-off')
        }else{
          target.attr('title', title).attr('data-status', 1).children('.fa')
                .removeClass('fa-toggle-off').addClass('fa-toggle-on')
        }
      }, 600)
    }else{
      $.dialog().fail({message: '设置失败，请稍后重试'})
    }
  })
  .fail(function() {
    console.log("error");
  })
}