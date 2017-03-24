/* 商家类型管理 */

//商家类型数据表格
const partnerTypeDataTable = $('#partnerTypeDataTable');
//角色功能树
const roleFunctionTree = $('#roleFunctionTree');
const DELAY_TIME = 600;
//权限列表对象
const roleList = $('#roleList');
//每项权限
const roleItem = roleList.children('li').not('.active');
//权限名称
const roleName = roleItem.children('.role');
//权限选中标志
const roleCheck = roleItem.children('.check');
//渲染数据表格
$(function(){
	partnerTypeDataTable.length === 1 && partnerTypeDataTable.dataTable();
})
//商家类型表单
const partTypeForm = $('#partTypeForm'),
			modalTitle = $('#partTypeModal').find('.modal-title'),
	    partTypeName = $('#partTypeName'),
	    partTypeNote = $('#partTypeNote'),
	    partTypeBtn = $('#partTypeBtn');
var partner_type = {};
var partTypeId;
var msg;
//新增类型
$('#newPartType').on('click', function(e){
	e.preventDefault();
	modalTitle.html('新增商家类型');
	$('.btn-reset').click();
	partTypeId = '';
	msg = '新增';
})

//商家类型编辑
$('.btn-edit').on('click', function(e){
	const $tr = $(this).parents('tr');
	partTypeId = $tr.data('type');
	modalTitle.html('商家类型编辑')
	partTypeName.val($tr.find('.name').text());
	partTypeNote.val($tr.find('.note').text());
	msg = '编辑';
})
//类型保存
partTypeBtn.on('click', function(e){
	e.preventDefault();
	if(!(simpleCheckInput(partTypeName) && simpleCheckInput(partTypeNote))) return false;
	partner_type = {
		id: partTypeId,
		name: $.trim(partTypeName.val()),
		note: $.trim(partTypeNote.val()),
	}
	savePartType(partner_type, msg)
})
//商家类型保存
function savePartType(partner_type, msg){
	$.ajax({
		url: '/system/save_partner_type',
		type: 'POST',
		data: {partner_type: partner_type},
	})
	.done(function(res) {
		if(res.status == 1){
			$.dialog().success({message: ''+msg+'成功', delay: DELAY_TIME})
			setTimeout(function(){
				location.replace(location.href)
			}, DELAY_TIME)
		}else{
			$.dialog().fail({message: ''+msg+'失败，请稍后重试'})
		}
	})
	.fail(function() {
		console.log("error");
	})
}
//选择权限
roleItem.on('click', function(e){
	const _this = $(this);
	_this.hasClass('checked') && 
	_this.removeClass('checked').children('.check').hide() ||
	_this.addClass('checked').children('.check').show()
})
//点击权限查看对应功能
roleName.on('click', function(e){
	e.stopPropagation();
	let roleId = $(this).parent().data('role');
	getFuncByRole(roleId)
})

//获取权限对应的功能点
function getFuncByRole(roleId){
  $.ajax({
  	url: '/system/get_role_func?id='+ roleId,
  })
  .done(function(res) {
  	const funcs = res.funcs;
		const setting = {
    	view: {
    		selectedMulti: false,
    	},
    	data: {
        simpleData: {
          enable: true 
        }
      },
		}
    var zNode = [];
    var treeObj;
    funcs.forEach(function(func){
    	var iconSkin;
      if(!func.parentId){
        iconSkin = 'root'
      }else if(func.funcType == 0){
    		iconSkin = 'folder'
    	}
      treeObj = {
        id: func.funcId,
        pId: func.parentId,
        name: func.name,
        open: true,
        iconSkin: iconSkin,
      };
      zNode.push(treeObj)
    })
    $.fn.zTree.init(roleFunctionTree, setting, zNode);
  })
  .fail(function() {
  	console.log("error");
  })
}