/* 系统角色管理 */
//功能树
const functionTree = $('#functionTree');
const DELAY_TIME = 600;
//渲染数据表格 加载功能树
$(function(){
	$('#roleDataTable').dataTable();
	getFunctionTree();
})
//判断父节点
function isParent(treeNode){
	return treeNode.isParent;
} 
//操作按钮
const btnNew = $('.btn-new'),
			btnEdit = $('.btn-edit'),
			btnConfig = $('.btn-config'),
			btnRemove = $('.btn-remove');
//角色表单对象
const roleModal = $('#roleModal'),
			roleTitle = roleModal.find('.modal-title'),
			roleForm = $('#roleForm'),
	    roleName = $('#roleName'),
	    roleDesc = $('#roleDesc'),
	    roleBtn = $('#roleBtn'),
	    btnReset = $('#btnReset');
//表单验证
function checkRoleForm(){
	return simpleCheckInput(roleName) && simpleCheckInput(roleDesc)
}
var roleId;
var title;
//获取选中行数据
function getRowData(target){
	const $tr = $(target).parents('tr');
	roleId = $tr.data('role');
	const rowData = {
		id: roleId,
		name: $tr.find('.name').text(),
		desc: $tr.find('.desc').text()
	}
	return rowData;
}
//角色新增
btnNew.on('click', function(e){0
	roleId = '';
	title = '新增';
	btnReset.click()
})
//角色编辑
btnEdit.on('click', function(e){
	const role = getRowData(this);
	roleId = role.id;
	title = '编辑';
	roleTitle.text('角色编辑')
	roleName.val(role.name);
	roleDesc.val(role.desc);
})
//角色保存
roleBtn.on('click', function(e){
	e.preventDefault();
	if(!checkRoleForm()) return false;
	const roleObj = {
		id: roleId,
		name: $.trim(roleName.val()),
		desc: $.trim(roleDesc.val()),
	}
	saveRole(roleObj, title)
})
function saveRole(roleObj, title){
	$.ajax({
		url: '/system/save_role',
		type: 'POST',
		data: {role: roleObj},
	})
	.done(function(res) {
		if(res.status == 1){
			$.dialog().success({message: ''+title+'成功', delay: DELAY_TIME})
			setTimeout(function(){
				location.replace(location.href)
			}, DELAY_TIME)
		}else{
			$.dialog().fail({message: ''+title+'失败，请稍后重试'})
		}
	})
	.fail(function() {
		console.log("error");
	})
}
//角色删除
btnRemove.on('click', function(e){
	e.preventDefault();
	const $tr = $(this).parents('tr');
	const roleId = $tr.data('role');
	const name = $tr.children('.name').text();
	$.dialog().confirm({message: '确定删除角色<a>'+name+'</a>？'})
   .on('confirm', function(){
   	  removeRole(roleId, $tr)
   })
})
function removeRole(roleId, $tr){
	$.ajax({
		url: '/system/remove_role?id='+ roleId,
	})
	.done(function(res) {
		if(res.status == 1){
			$.dialog().success({message: '删除成功', delay: DELAY_TIME})
			setTimeout(function(){
				if($tr.length === 1){
					$tr.remove()
				}
			}, DELAY_TIME)
		}else if(res.status == 2){
			$.dialog().fail({message: '该角色拥有功能点，删除失败'})
		}else{
			$.dialog().fail({message: '删除失败，请稍后重试'})
		}
	})
	.fail(function(){
		console.log("error");
	})
}
//角色配置功能
btnConfig.on('click', function(e){
	roleId = getRowData(this).id;
	getFuncByRole(roleId)
})
//获取功能树
function getFunctionTree(){
	$.ajax({
		url: '/system/get_function_tree',
		type: 'GET',
	})
	.done(function(res) {
		const funcs = res.funcs;
		const setting = {
    	view: {
    		selectedMulti: false,
    	},
    	check: {
    		enable: true
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
        funcUrl: func.funcUrl,
        desc: func.funcDesc,
        funcLevel: func.funcLevel,
        seq: func.funcSeq,
        funcType: func.funcType, 
        status: func.status,
        open: true,
        iconSkin: iconSkin,
      };
      zNode.push(treeObj)
    })
    $.fn.zTree.init(functionTree, setting, zNode);
	})
	.fail(function() {
		console.log("error");
	})
}
//获取角色对应的功能点
function getFuncByRole(roleId){
	$.ajax({
		url: '/system/get_role_func?id='+ roleId,
	})
	.done(function(res) {
		const funcs = res.funcs;
    const treeObj = $.fn.zTree.getZTreeObj("functionTree");
		const nodes = treeObj.transformToArray(treeObj.getNodes());
		for(let i = 0; i < nodes.length; i++) {
			treeObj.checkNode(nodes[i], false, true);
		}
    var temp = [];
    var targetNodes = [];
    for(let i = 0; i < funcs.length; i++){
    	temp[funcs[i].funcId] = true;
    }
    for(let i = 0; i < nodes.length; i++){
    	if(temp[nodes[i].id] && !isParent(nodes[i])){
    		targetNodes.push(nodes[i])
    	}
    }
		for(let i = 0; i < targetNodes.length; i++) {
			treeObj.checkNode(targetNodes[i], true, true);
		}
	})
	.fail(function() {
		console.log("error");
	})
}
//配置角色功能
$('#configRoleBtn').on('click', function(e){
	const treeObj = $.fn.zTree.getZTreeObj("functionTree");
	const nodes = treeObj.getCheckedNodes(true);
	//传统写法
	// const funcList = [];
	// nodes.forEach(function(node){
	// 	if(node.check_Child_State === -1){
	// 		funcList.push(node.id)
	// 	}
	// })
	//ES6语法
	const isCheckNode = node => node.check_Child_State === -1;
	const getNodeId = node => node.id;
	const funcIdList = nodes.filter(isCheckNode).map(getNodeId);
	const role_func = {
		roleId: roleId,
		funcList: funcIdList,
	}
	$.ajax({
		url: '/system/config_role_func',
		type: 'POST',
		data: {role_func: role_func},
	})
	.done(function(res) {
		if(res.status == 1){
			$.dialog().success({message: '配置成功', delay: DELAY_TIME})
		}else{
			$.dialog().fail({message: '配置失败，请稍后重试'})
		}
	})
	.fail(function() {
		console.log("error");
	})
})
//设置角色状态
$('.btn-status').on('click', function(e){
	const _this = $(this);
	const $tr = _this.parents('tr');
	const status = parseInt(_this.attr('data-status'));
	const roleId = $tr.data('role');
	const name = $tr.find('.name').text();
	const info = status ? '禁用状态' : '启用状态';
	$.dialog().confirm({message: '确定将<a>'+name+'</a>设为'+info+'？'})
	 .on('confirm', function(){
 		setRoleStatus(roleId, status, _this)
	 })
})
function setRoleStatus(roleId, status, toggleBtn){
	$.ajax({
		url: '/system/set_role_status',
		type: 'POST',
		data: {id: roleId, status: status},
	})
	.done(function(res) {
		if(res.status == 1){
			$.dialog().success({message: '设置成功', delay: DELAY_TIME})
			console.log(roleId, status, toggleBtn)
			setTimeout(function(){
				if(status == 1){
					toggleBtn.attr('data-status', 0).attr('title', '禁用状态')
									 .children('.fa').removeClass('fa-toggle-on').addClass('fa-toggle-off');
				}else{
					toggleBtn.attr('data-status', 1).attr('title', '启用状态')
									 .children('.fa').removeClass('fa-toggle-off').addClass('fa-toggle-on');
				}
			}, DELAY_TIME)
		}else{
			$.dialog().fail({message: '设置失败，请稍后再试'})
		}
	})
	.fail(function() {
		console.log("error");
	})
}