/* 岗位管理 */
//岗位数据表格
const titleDataTable = $('#titleDataTable');
//渲染岗位数据列表
$(function(){
	titleDataTable.DataTable({})
})
//编辑、删除按钮
const $btnEdit = $('.btn-edit'),
			$btnRemove = $('.btn-remove');
//新增岗位表单
const newTitleForm = $('#newTitleForm'),
			titleName = $('#titleName'),
			titleDesc = $('#titleDesc'),
			newTitleBtn = $('#newTitleBtn');
const regular = {
	desc: /^.{1,20}$/
}
const msg = {
	desc: {
		regular: '字数超过限制'
	}
}
newTitleBtn.on('click', function(e){
	e.preventDefault();
	if(!(checkInput(titleName) && checkInput(titleDesc, msg.desc, regular.desc))) return false;
	newTitleForm.submit()
})	
//编辑岗位表单	
const editTitleForm = $('#editTitleForm'),
			editTitleId = $('#editTitleId'),
			editTitleName = $('#editTitleName'),
			editTitleDesc = $('#editTitleDesc'),
			editTitleBtn = $('#editTitleBtn');
//岗位信息回显
$btnEdit.on('click', function(e){
	var $tr = $(this).parents('tr');
	var id = $tr.attr('data-id'),
      name = $tr.find('.title-name').text(),
      desc = $tr.find('.title-desc').text();
  editTitleId.val(id);
  editTitleName.val(name);
  editTitleDesc.val(desc);
})
///编辑岗位提交			
editTitleBtn.on('click', function(e){
	e.preventDefault();
	if(simpleCheckInput(editTitleName) && simpleCheckInput(editTitleDesc)){
		editTitleForm.submit()
	}else{
		return false;
	}
})	
//删除岗位
$btnRemove.on('click', function(req, res){
	var $tr = $(this).parents('tr');
	var id = $tr.attr('data-id'),
			name = $tr.find('.title-name').text();
	$.dialog().confirm({message: '确定删除 '+name+ ' ? 此操作不可恢复'})
	.on('confirm', function(){
		removeTitle(id, $tr)
	})
	.on('cancel', function(){
	})
})
function removeTitle(id, $tr){
	$.ajax({
		url: '/partner/remove_title?id='+ id,
	})
	.done(function(res, status, xhr) {
		if(res.status == 1){
			$.dialog().success({message: '删除成功', delay: 600})
			setTimeout(function(){
				if($tr.length === 1){
					$tr.remove()
				}
			}, 600)
		}else{
			$.dialog().fail({message: '删除失败，请稍后重试'})
		}
	})
	.fail(function(xhr, status) {
		console.log(status)
		if(xhr.status == 302){
			location.replace(location.href)
		}else{
			$.dialog().fail({message: '服务器响应失败，请稍后重试'})
		}
	})
}