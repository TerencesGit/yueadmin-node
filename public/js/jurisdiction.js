const partnerDataTable = $('#partnerDataTable');
//权限列表对象
const roleList = $('#roleList');
//权限单元
const roleItem = roleList.children('li').not('.active');
//权限名称
const roleName = roleList.find('.role');
$(function(){
	partnerDataTable.DataTable()
})
//权限列表回显
function getRoleByOrgId(orgId){
	$.ajax({
		url: '/partner/get_org_role?id='+ orgId,
	})
	.done(function(res) {
		const orgRoles = res.orgRoles;
		const getRoleId = orgRole => orgRole.role;
		const roleIdList = orgRoles.map(getRoleId);
		for(let i = 0; i < roleItem.length; i++){
			for(let j = 0; j < roleIdList.length; j++){
				if(roleItem[i].getAttribute('data-id') == roleIdList[j]){
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
	let roleId = $(this).parent().attr('data-id');
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
		  callback: {
		    onClick: HandlerClick,
		  }
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
//选择权限(选中显示对号，非选中反之)
roleItem.on('click', function(){
	if($(this).hasClass('checked')){
		$(this).removeClass('checked').children('.check').hide()
	}else{
		$(this).addClass('checked').children('.check').show()
	}
})
// 设置权限
$('#setRoleBtn').on('click', function(e){
	e.preventDefault();
	if(!getSeletedNode()) return false;
 	const node = getSeletedNode();
  const orgId = node.id;
	const checkedList = roleList.children('.checked');
	const roleIdList= [];
	checkedList.each(function(index, roleItem){
		roleIdList.push(roleItem.getAttribute('data-id'))
	})
	const org_role = {
		org_id: orgId,
		role_list: roleIdList
	}
	if(flag){
		flag = false;
		$.ajax({
			url: '/partner/set_org_role',
			type: 'POST',
			data: {org_role: org_role},
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
//设置企业启用禁用状态
var partnerId;
const btnBan = $('.btn-ban'),
      btnUnBan = $('.btn-unban');
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