//企业表格
const partnerDataTable = $('#partnerDataTable');
//企业数据表格渲染
$(function(){
	partnerDataTable.DataTable()
})
//功能树
const roleFunctionTree = $('#roleFunctionTree');
let flag = true;
//权限列表对象
const roleList = $('#roleList');
//每项权限
const roleItem = roleList.children('li').not('.active');
//权限名称
const roleName = roleItem.children('.role');
//权限选中标志
const roleCheck = roleItem.children('.check');
//企业Id
let partnerId;
//设置权限按钮
const btnJuris = $('.btn-jurisdiction');
//设置启用禁用按钮
const btnBan = $('.btn-ban'),
      btnUnBan = $('.btn-unban');
//获取点击按钮所在行的数据      
function getRowData($target){
	const $tr = $target.parents('tr');
	const id = $tr.data('id'),
				name = $tr.children('.name').text();
	return {id: id, name: name};
}
//获取按钮所在行的企业Id
btnJuris.on('click', function(){
	roleItem.removeClass('checked');
	partnerId = getRowData($(this)).id;
	getRoleByPartId(partnerId);
})
//权限列表回显
function getRoleByPartId(partId){
	$.ajax({
		url: '/admin/get_role_by_partner?id='+ partId,
	})
	.done(function(res) {
		const partRoles = res.partRoles;
		const getRoleId = partRole => partRole.role;
		const roleIdList = partRoles.map(getRoleId);
		for(let i = 0; i < roleItem.length; i++){
			for(let j = 0; j < roleIdList.length; j++){
				if($(roleItem[i]).data('role') == roleIdList[j]){
					$(roleItem[i]).addClass('checked')
					break;
				}
			}
		}
	})
	.fail(function() {
		console.log("error");
	})
}
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
  	const roleFuncs = res.role_funcs;
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
    roleFuncs.forEach(function(role_func){
      treeObj = {
        id: role_func.func._id,
        pId: role_func.func.parent_id,
        name: role_func.func.name,
        open: true
      };
      zNode.push(treeObj)
    })
    $.fn.zTree.init(roleFunctionTree, setting, zNode);
  })
  .fail(function() {
  	console.log("error");
  })
}
//选择权限
roleItem.on('click', function(e){
	const _this = $(e.target);
	_this.hasClass('checked') && 
	_this.removeClass('checked').children('.check').hide() ||
	_this.addClass('checked').children('.check').show()
})
roleCheck.on('click', function(){
	$(this).parent('li').click()
})
// 设置权限
$('#setJurisdictionBtn').on('click', function(e){
	e.preventDefault();
	const checkedList = roleList.children('.checked');
	const roleIdList= [];
	checkedList.each(function(index, roleItem){
		roleIdList.push($(roleItem).data('role'))
	})
	const part_role = {
		part_id: partnerId,
		role_list: roleIdList
	}
	if(flag){
		flag = false;
		$.ajax({
			url: '/admin/set_partner_role',
			type: 'POST',
			data: {part_role: part_role},
		})
		.done(function(res) {
			if(res.status == 1){
				$.dialog().success({message: '设置成功', delay: 1000})
			}else{
				$.dialog().fail({message: '设置失败, 请稍后重试'})
			}
		})
		.fail(function() {
			console.log("error");
		})
		.always(function(){
			flag = true;
		})
	}
})


//设置企业禁用      
btnBan.on('click', function(e){
	const $tr = $(this).parents('tr');
	const	partnerId = $tr.data('id'),
	      name = $tr.children('td').eq(1).text();
	$.dialog().confirm({message: '确定将'+name+'设为禁用状态'})
	 .on('confirm', function(){
	 		setPartnerStatus(partnerId, 0)
	 })
})
//设置企业启用   
btnUnBan.on('click', function(e){
	const $tr = $(this).parents('tr');
	const	partnerId = $tr.data('id'),
	      name = $tr.children('td').eq(1).text();
	$.dialog().confirm({message: '确定将'+name+'设为启用状态'})
	 .on('confirm', function(){
	 		setPartnerStatus(partnerId, 1)
	 })
})
function setPartnerStatus(pid, stid){
	$.ajax({
		url: '/admin/set_partner_status?pid='+ pid +'&&stid='+ stid,
		type: 'GET',
	})
	.done(function(res) {
		if(res.status == 1){
			$.dialog().success({message: '设置成功', delay: 600})
			setTimeout(function(){
        location.replace(location.href)
      }, 600)
		}else{
			$.dialog().fail({message: '设置失败，请稍后重试'})
		}
	})
	.fail(function() {
		console.log("error");
	})
}