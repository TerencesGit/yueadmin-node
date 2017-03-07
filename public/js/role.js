/* 系统角色管理 */
//功能树
const functionTree = $('#functionTree');
//角色数据表格
const roleDataTable = $('#roleDataTable');
//判断父节点
function isParent(treeNode){
	return treeNode.isParent;
} 
//渲染数据表格 加载功能树
$(function(){
	roleDataTable.dataTable();
	getFunctionTree()
})
//角色设置按钮
var btnCreate = $('.btn-create'),
		btnDel = $('.btn-del'),
		btnSet = $('.btn-set');

//创建角色
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
	const $tr = $(this).parents('tr');
	const id = $tr.attr('data-id');
	const name = $tr.children('.name').text();
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
			$.dialog().fail({message: '删除失败，请稍后重试'})
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
	getFuncByRole(roleId)
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
		}
    var zNode = [];
    var treeObj;
    functions.forEach(function(func){
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
		var roleFuncs = res.role_funcs;
    var treeObj = $.fn.zTree.getZTreeObj("functionTree");
		var nodes = treeObj.transformToArray(treeObj.getNodes());
		for (let i = 0; i < nodes.length; i++) {
			treeObj.checkNode(nodes[i], false, true);
		}
    var temp = [];
    var targetNodes = [];
    for(let i = 0; i < roleFuncs.length; i++){
    	temp[roleFuncs[i].func._id] = true;
    }
    for(let i = 0; i < nodes.length; i++){
    	if(temp[nodes[i].id] && !isParent(nodes[i])){
    		targetNodes.push(nodes[i])
    	}
    }
		for (let i = 0; i < targetNodes.length; i++) {
			treeObj.checkNode(targetNodes[i], true, true);
		}
	})
	.fail(function() {
		console.log("error");
	})
}
//设置角色拥有的功能
$('#setRoleBtn').on('click', function(e){
	var treeObj = $.fn.zTree.getZTreeObj("functionTree");
	var nodes = treeObj.getCheckedNodes(true);
	console.log(nodes)
	if(nodes.length === 0) return false;
	//传统写法
	// const funcList = [];
	// nodes.forEach(function(node){
	// 	if(node.check_Child_State === -1){
	// 		funcList.push(node.id)
	// 	}
	// })
	//ES6语法
	//获取被选中节点不包括其父节点，暂时注释
	//const isCheckNode = node => node.check_Child_State === -1;
	const getNodeId = node => node.id;
	const funcIdList = nodes.map(getNodeId)
	console.log(funcIdList)
	
	const role_func = {
		roleId: roleId,
		funcList: funcIdList
	}
	$.ajax({
		url: '/system/assign_function',
		type: 'POST',
		data: {role_func: role_func},
	})
	.done(function(res) {
		if(res.status == 1){
			$.dialog().success({message: '配置成功', delay: 600})
		}else{
			$.dialog().fail({message: '配置失败，请稍后重试'})
		}
	})
	.fail(function() {
		console.log("error");
	})
})