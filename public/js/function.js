//功能树对象
const functionTree = $('#functionTree');
//功能点详情表格
const funcTable = $('#funcTable');
//组织节点点击事件
function HandlerClick(event, treeId, treeNode){
	// if(isRoot(treeNode)) return false;
  const name = treeNode.name;
  const functionId = treeNode.id;
  getFunctionNode(functionId)
  //showFuncDetail(treeNode)
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
	const treeObj = $.fn.zTree.getZTreeObj("functionTree");
  const node = treeObj.getSelectedNodes()[0];
  if(!node){
  	$.dialog().alert({message: '请选择要操作的节点！'})
    return false;
  }
 	return node;
}
//加载功能树
$(function(){
	getFunctionTree()
})
function getFont(treeId, node) {
	return node.font ? node.font : {};
}

//获取功能树
function getFunctionTree(){
	$.ajax({
		url: '/system/get_function_tree',
	})
	.done(function(res) {
		const functions = res.functions;
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
    const zNode = [];
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
//异步获取单个功能节点详情
function getFunctionNode(id){
	$.ajax({
		url: '/system/get_function_node?id='+ id,
	})
	.done(function(res) {
		if(res.status == 0) return $.dialog().alert({message: '获取失败, 请稍后重试'})
		const func = res.func;
	  var funcTbody = '';
	  var sStatus = func.status == 1 ? '启用' : '停用';
	  var sType = func.funcType == 1 ? '实功能点' : '虚功能点';
	  funcTbody = '<tr><td>'+func.name+'</td><td>'+func.funcUrl+'</td>\
				         <td>'+func.funcDesc+'</td><td>'+func.funcLevel+'</td>\
				         <td>'+func.funcSeq+'</td><td>'+sType+'</td>\
				         <td>'+sStatus+'</td><td>'+func.createTime.substr(0, 10)+'</td></tr>';
	  funcTable.removeClass('hidden').find('tbody').empty().append(funcTbody);
	})
	.fail(function() {
		console.log("error");
	})
}
//显示功能点详情
function showFuncDetail(func){
	var funcTbody = '';
  funcTbody = ('<tr><td>'+func.name+'</td><td>'+func.funcUrl+'</td>\
      <td>'+func.funcDesc+'</td><td>'+func.funcLevel+'</td>\
      <td>'+func.funcSeq+'</td><td>'+func.funcType+'</td>\
      <td>'+func.status+'</td><td>'+func.createTime+'</td></tr>') 
  funcTable.removeClass('hidden').find('tbody').empty().append(funcTbody);
}
// 工具按钮
const btnNew = $('.btn-new'),
		  btnEdit = $('.btn-edit'),
		  btnRemove = $('.btn-remove');

//添加功能节点表单
const newFunctionModal = $('#newFunctionModal'),
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
	const node = getSeletedNode();
  newFunctionTitle.html('添加<a>'+node.name+'</a>下的子模块');
  btnReset.click()
})
newFunctionBtn.on('click', function(e){
		e.preventDefault();
	  if(!getSeletedNode()) return false;
	  const node = getSeletedNode();
		if(!(simpleCheckInput(newFunctionName) && 
				 simpleCheckInput(newFunctionRouter) && 
				 simpleCheckInput(newFunctionDesc))) return false;
		const name = $.trim(newFunctionName.val()),
					router = $.trim(newFunctionRouter.val()),
					desc = $.trim(newFunctionDesc.val()),
					note = $.trim(newFunctionNote.val());
		const func = {
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
const editFunctionModal = $('#editFunctionModal'),
			editFunctionTitle = editFunctionModal.find('.modal-title'),
			editFunctionName = $('#editFunctionName'),
			editFunctionRouter = $('#editFunctionRouter'),
			editFunctionDesc = $('#editFunctionDesc'),
			editFunctionNote = $('#editFunctionNote'),
			editFunctionBtn = $('#editFunctionBtn');

btnEdit.on('click', function(){
	if(!getSeletedNode()) return false;
	const node = getSeletedNode();
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
  const node = getSeletedNode();
	if(!(simpleCheckInput(editFunctionName) && 
			 simpleCheckInput(editFunctionRouter) && 
			 simpleCheckInput(editFunctionDesc))) return false;
	const name = $.trim(editFunctionName.val()),
			router = $.trim(editFunctionRouter.val()),
			desc = $.trim(editFunctionDesc.val()),
			note = $.trim(editFunctionNote.val());
		const func = {
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
//删除功能节点
btnRemove.on('click', function(e){
	e.preventDefault();
  if(!getSeletedNode()) return false;
  const node = getSeletedNode();
  if(isParent(node)){
  	return $.dialog().alert({message: '父节点不可删除'})
  }
  const name = node.name,
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