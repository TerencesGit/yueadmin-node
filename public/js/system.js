const functionTree = $('#functionTree');

//组织节点点击事件
function HandlerClick(event, treeId, treeNode){
	if(isRoot(treeNode)) return false;
  var name = treeNode.name;
  var functionId = treeNode.id;
  getFunctionNode(functionId)
}
//判断父节点
function isParent(treeNode){
	return treeNode.isParent;
}
//判断根节点
function isRoot(treeNode){
	return !treeNode.pId;
}
//获取被选中的单个节点
function getSeletedNode(){
	var treeObj = $.fn.zTree.getZTreeObj("functionTree");
  var node = treeObj.getSelectedNodes()[0];
  if(!node){
  	$.dialog().alert({message: '请选择要操作的节点！'})
    return false;
  }
 	return node;
}
$(function(){
	getFunctionTree()
})
//获取功能树
function getFunctionTree(){
	$.ajax({
		url: '/system/get_function_tree',
		type: 'GET',
	})
	.done(function(res) {
		var functions = res.functions;
		 var setting = {
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
		  callback: {
		    onClick: HandlerClick,
		  }
		}
    var zNode = [];
    var treeObj;
    functions.forEach(function(func){
      treeObj = {
        id: func._id,
        pId: func.parent_id,
        name: func.name,
        router: func.router,
        desc: func.desc,
        note: func.note,
        open: true
      };
      zNode.push(treeObj)
    })
    $.fn.zTree.init(functionTree, setting, zNode);
	})
	.fail(function() {
		console.log("error");
	})
}
//获取单个功能节点
function getFunctionNode(id){
	$.ajax({
		url: '/system/get_function_node?id='+ id,
	})
	.done(function(res) {
		if(res.status == 0) return $.dialog().alert({message: '获取失败, 请稍后重试'})
		var func = res.func;
	  var funcHtml = '';
	  let updater = func.updater ? func.updater.name : '暂无';
	  let createAt = func.meta.createAt.substr(0,10);
	  funcHtml = ('<tr><td>'+func.name+'</td><td>'+func.router+'</td>\
        <td>'+func.desc+'</td><td>'+func.note+'</td>\
        <td>'+func.creator.name+'</td><td>'+updater+'</td>\
        <td>'+createAt+'</td></tr>') 
	  $('.func-detail').empty().append(funcHtml)
	})
	.fail(function() {
		console.log("error");
	})
}
// 工具按钮
const btnNew = $('.btn-new'),
		  btnEdit = $('.btn-edit'),
		  btnRemove = $('.btn-remove');

//添加功能节点表单
var newFunctionModal = $('#newFunctionModal'),
		newFunctionTitle = $('#newFunctionTitle'),
		newFunctionName = $('#newFunctionName'),
		newFunctionRouter = $('#newFunctionRouter'),
		newFunctionDesc = $('#newFunctionDesc'),
		newFunctionNote = $('#newFunctionNote'),
		newFunctionBtn = $('#newFunctionBtn'),
		btnReset = $('#btnReset');
//添加功能节点
btnNew.on('click', function(){
	if(!getSeletedNode()) return false;
	var node = getSeletedNode();
  newFunctionTitle.html('添加<a>'+node.name+'</a>下的子模块');
  btnReset.click()
})
newFunctionBtn.on('click', function(e){
	e.preventDefault();
  if(!getSeletedNode()) return false;
  var node = getSeletedNode();
	if(!(simpleCheckInput(newFunctionName) && 
			 simpleCheckInput(newFunctionRouter) && 
			 simpleCheckInput(newFunctionDesc))) return false;
	var name = $.trim(newFunctionName.val()),
			router = $.trim(newFunctionRouter.val()),
			desc = $.trim(newFunctionDesc.val()),
			note = $.trim(newFunctionNote.val());
		var func = {
			parent_id: node.id,
			name: name,
			router: router,
			desc: desc,
			note: note
		}
		$.ajax({
			url: '/system/new_function',
			type: 'post',
			data: {func: func},
		})
		.done(function(res) {
			if(res.status == 1){
				$.dialog().success({message: '添加成功', delay: 1000})
				setTimeout(function(){
					getFunctionTree()
				},1000)
			}else{
				$.dialog().alert({message: '添加失败, 请稍后重试'})
			}
			console.log("success");
		})
		.fail(function(error) {
			console.log("error");
		})
})

//编辑功能节点
var editFunctionModal = $('#editFunctionModal'),
		editFunctionTitle = editFunctionModal.find('.modal-title'),
		editFunctionName = $('#editFunctionName'),
		editFunctionRouter = $('#editFunctionRouter'),
		editFunctionDesc = $('#editFunctionDesc'),
		editFunctionNote = $('#editFunctionNote'),
		editFunctionBtn = $('#editFunctionBtn');

btnEdit.on('click', function(){
	if(!getSeletedNode()) return false;
	var node = getSeletedNode();
	if(isRoot(node)) {
		$.dialog().alert({message: '根节点不可编辑'})
		return false;
	}
  editFunctionTitle.html('编辑<a>'+node.name+'</a>模块');
  editFunctionName.val(node.name);
  editFunctionRouter.val(node.router);
  editFunctionDesc.text(node.desc);
  editFunctionNote.text(node.note)
})
editFunctionBtn.on('click', function(e){
	e.preventDefault();
  if(!getSeletedNode()) return false;
  var node = getSeletedNode();
	if(!(simpleCheckInput(editFunctionName) && 
			 simpleCheckInput(editFunctionRouter) && 
			 simpleCheckInput(editFunctionDesc))) return false;
	var name = $.trim(editFunctionName.val()),
			router = $.trim(editFunctionRouter.val()),
			desc = $.trim(editFunctionDesc.val()),
			note = $.trim(editFunctionNote.val());
		var func = {
			id: node.id,
			name: name,
			router: router,
			desc: desc,
			note: note
		}
		$.ajax({
			url: '/system/edit_function',
			type: 'post',
			data: {func: func},
		})
		.done(function(res) {
			if(res.status == 1){
				$.dialog().success({message: '编辑成功', delay: 1000})
				setTimeout(function(){
					getFunctionTree()
				},1000)
			}else{
				$.dialog().alert({message: '编辑失败, 请稍后重试'})
			}
		})
		.fail(function(error) {
			console.log("error");
		})
})
//删除功能模块
btnRemove.on('click', function(e){
	e.preventDefault();
  if(!getSeletedNode()) return false;
  var node = getSeletedNode();
  if(isParent(node)){
  	return $.dialog().alert({message: '父节点不可删除'})
  }
  var name = node.name,
  		id = node.id;
  $.dialog().confirm({message: '确定删除<a>'+name+'</a>, 此操作不可恢复'})
   .on('confirm', function(){
   	romoveFunctionNode(id)
   })
})
function romoveFunctionNode(id){
	$.ajax({
		url: '/system/remove_function?id='+id,
	})
	.done(function(res) {
		if(res.status == 0){
			$.dialog().error({message: '根节点禁止删除'})
		}else if(res.status == 1){
			$.dialog().success({message: '删除成功', delay: 1000})
			setTimeout(function(){
					getFunctionTree()
			},1000)
		}else{
			$.dialog().error({message: '删除失败, 请稍后重试'})
		}
	})
	.fail(function() {
		console.log("error");
	})
}
//角色创建
var btnCreate = $('.btn-create'),
		btnDel = $('.btn-del'),
		btnSet = $('.btn-set');

var newRoleForm = $('#newRoleForm'),
	  newRoleName = $('#newRoleName'),
	  newRoleDesc = $('#newRoledesc'),
	  newRoleBtn = $('#newRoleBtn');

newRoleBtn.on('click', function(e){
	e.preventDefault();
	if(!simpleCheckInput(newRoleName)) return false;
	newRoleForm.submit()
})

//角色删除
btnDel.on('click', function(e){
	e.preventDefault();
	var $tr = $(this).parents('tr');
	var id = $tr.attr('data-id');
	var name = $tr.children('td').eq(0).text();
	$.dialog().confirm({message: '确定删除<a>'+name+'</a>, 此操作不可恢复'})
   .on('confirm', function(){
   	removeRole(id, $tr)
   })
})
function removeRole(id, $tr){
	$.ajax({
		url: '/system/role_remove?id='+ id,
	})
	.done(function(res) {
		if(res.status == 1){
			$.dialog().success({message: '删除成功', delay: 1000})
			setTimeout(function(){
				if($tr.length === 1){
					$tr.remove()
				}
			}, 1000)
		}else{
			$.dialog().alert({message: '删除失败，请稍后重试'})
		}
	})
	.fail(function() {
		console.log("error");
	})
}
var roleId;
btnSet.on('click', function(e){
	var $tr = $(this).parents('tr');
	roleId = $tr.attr('data-id');
	console.log(roleId)
})
$('#setRoleBtn').on('click', function(e){
	var treeObj = $.fn.zTree.getZTreeObj("functionTree");
	var nodes = treeObj.getCheckedNodes(true);
	console.log(nodes)
	if(nodes.length === 0) return false;
	var funcArr = [];
	nodes.forEach(function(node){
		if(node.check_Child_State === -1){
			funcArr.push(node.id)
		}
	})
	var role_func = {
		roleId: roleId,
		funcArr: funcArr
	}
	$.ajax({
		url: '/system/assign_function',
		type: 'POST',
		data: {role_func: role_func},
	})
	.done(function(res) {

		console.log(res);
	})
	.fail(function() {
		console.log("error");
	})
})