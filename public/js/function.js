//系统功能树管理
//功能树对象
const functionTree = $('#functionTree');
//功能点详情表格
const funcTable = $('#funcTable');
const DELAY_TIME = 600;
//判断父节点
function isParent(treeNode){
	return treeNode.isParent;
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
//组织节点点击事件
function HandlerClick(event, treeId, treeNode){
  showFuncDetail(treeNode)
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
		  callback: {
		    onClick: HandlerClick,
		  }
		}
    const zNode = [];
    var treeObj;
    funcs.forEach(function(func){
    	var iconSkin;
    	var isOpen;
    	if(!func.parentId){
    		iconSkin = 'root';
    		isOpen = true;
    	}else if(func.funcType == 0){
    		iconSkin = 'folder';
    		isOpen = true;
    	}
    	treeObj = {
        id: func.funcId,
        pId: func.parentId,
        name: func.name,
        viewname: func.viewname,
        desc: func.funcDesc,
        code: func.funcMd5,
        ico: func.funcIco,
        funcUrl: func.funcUrl,
        funcLevel: func.funcLevel,
        funcSeq: func.funcSeq,
        funcType: func.funcType, 
        status: func.status,
        updateTime: func.updateTime,
        open: isOpen,
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
	  var isMenu;
	  if(func.funcLevel == 0){
		  isMenu = '否';
	  }else{
		  isMenu = '是';
	  }
	  var sType;
	  if(func.funcType == 0){
		  sType='虚功能点';
	  }else if(func.funcType == 1){
		  sType='实功能点(页面)';
	  }else{
		  sType='实功能点(接口)';
	  }
	  funcTbody = '<tr><td>'+func.name+'</td><td>'+func.funcUrl+'</td>\
				         <td>'+func.funcDesc+'</td><td>'+isMenu+'</td>\
				         <td>'+sType+'</td><td>'+sStatus+'</td>\
				         <td>'+func.createTime.substr(0, 10)+'</td></tr>';
	  funcTable.removeClass('hidden').find('tbody').empty().append(funcTbody);
	})
	.fail(function() {
		console.log("error");
	})
}
//显示功能点详情
function showFuncDetail(func){
	var funcTbody = '';
	var sStatus = func.status == 1 ? '启用' : '停用';
  var isMenu;
  if(func.funcLevel == 0){
	  isMenu = '否';
  }else{
	  isMenu = '是';
  }
  var sType;
  if(func.funcType == 0){
	  sType='虚功能点';
  }else if(func.funcType == 1){
	  sType='实功能点(页面)';
  }else{
	  sType='实功能点(接口)';
  }
  funcTbody += ('<tr><td>'+func.name+'</td><td>'+func.funcUrl+'</td>\
      <td>'+func.desc+'</td><td>'+isMenu+'</td>\
      <td>'+sType+'</td><td>'+sStatus+'</td>\
      <td>'+func.updateTime.substr(0, 10)+'</td></tr>') 
  funcTable.removeClass('hidden').find('tbody').empty().append(funcTbody);
}
// 工具按钮
const btnNew = $('.btn-new'),
		  btnEdit = $('.btn-edit'),
		  btnRemove = $('.btn-remove');
//功能点表单
const newFuncModal = $('#newFuncModal'),
			newFuncTitle = $('#newFuncTitle'),
			newFuncName = $('#newFuncName'),
			newFuncDesc = $('#newFuncDesc'),
			newFuncView = $('#newFuncView'),
			newFuncCode = $('#newFuncCode'),
			newFuncIco = $('#newFuncIco'),
			newFuncUrl = $('#newFuncUrl'),
			newFuncSeq = $('#newFuncSeq'),
			newFuncLevel = $('#newFuncLevel'),
			newFuncType = $('#newFuncType'),
			newFuncStatus = $('#newFuncStatus'),
			newFuncBtn = $('#newFuncBtn'),
			newFuncResetBtn = $('#newFuncResetBtn');
//新增功能点按钮
btnNew.on('click', function(){
	if(!getSeletedNode()) return false;
  newFuncTitle.html('添加<a>'+getSeletedNode().name+'</a>下的子模块');
  newFuncResetBtn.click();
})
//新增功能表单验证
function checkFuncForm(){
	return simpleCheckInput(newFuncName) &&
				 simpleCheckInput(newFuncDesc) &&
				 simpleCheckInput(newFuncView) &&
				 simpleCheckInput(newFuncCode) &&
				 simpleCheckInput(newFuncUrl)  &&
				 simpleCheckInput(newFuncSeq)
}
//功能点表单提交
newFuncBtn.on('click', function(e){
		e.preventDefault();
	  if(!getSeletedNode()) return false;
		if(!checkFuncForm()) return false;
		const funcObj = {
			parent_id: getSeletedNode().id,
			name: $.trim(newFuncName.val()),
			desc: $.trim(newFuncDesc.val()),
			viewname: $.trim(newFuncView.val()),
			code: $.trim(newFuncCode.val()),
			ico: $.trim(newFuncIco.val()),
			router: $.trim(newFuncUrl.val()),
			seq: $.trim(newFuncSeq.val()),
			level: newFuncLevel.val(),
			type: newFuncType.val(),
			status:newFuncStatus.val(),
		}
		console.log(funcObj)
		$.ajax({
			url: '/system/new_function',
			type: 'post',
			data: {func: funcObj},
		})
		.done(function(res) {
			if(res.status == 1){
				$.dialog().success({message: '添加成功', delay: DELAY_TIME})
				setTimeout(function(){
					getFunctionTree()
				}, DELAY_TIME)
			}else{
				$.dialog().fail({message: '添加失败，请稍后重试'})
			}
			newFuncResetBtn.click()
		})
		.fail(function(error) {
			console.log("error");
		})
})

//编辑功能节点
const editFuncModal = $('#editFuncModal'),
			editFuncTitle = editFuncModal.find('.modal-title'),
			editFuncName = $('#editFuncName'),
			editFuncView = $('#editFuncView'),
			editFuncCode = $('#editFuncCode'),
			editFuncIco = $('#editFuncIco'),
			editFuncUrl = $('#editFuncUrl'),
			editFuncParentId = $('#editFuncParentId'),
			editFuncDesc = $('#editFuncDesc'),
			editFuncLevel = $('#editFuncLevel'),
			editFuncType = $('#editFuncType'),
			editFuncStatus = $('#editFuncStatus'),
			editFuncSeq = $('#editFuncSeq'),
			editFuncBtn = $('#editFuncBtn');
//功能点表单回显
btnEdit.on('click', function(){
	if(!getSeletedNode()) return false;
	const node = getSeletedNode();
  editFuncTitle.html('编辑<a>'+node.name+'</a>模块');
  editFuncName.val(node.name);
  editFuncView.val(node.viewname);
  editFuncCode.val(node.code);
  editFuncIco.val(node.ico);
  editFuncUrl.val(node.funcUrl);
  editFuncParentId.val(node.pId);
  editFuncDesc.val(node.desc);
  editFuncLevel.val(node.funcLevel);
  editFuncType.val(node.funcType);
  editFuncStatus.val(node.status);
  editFuncSeq.val(node.funcSeq);
})
//编辑功能点表单提交
editFuncBtn.on('click', function(e){
	e.preventDefault();
  if(!getSeletedNode()) return false;
	const funcObj = {
		id: getSeletedNode().id,
		parent_id: $.trim(editFuncParentId.val()),
		name: $.trim(editFuncName.val()),
		desc: $.trim(editFuncDesc.val()),
		viewname: $.trim(editFuncView.val()),
		code: $.trim(editFuncCode.val()),
		ico: $.trim(editFuncIco.val()),
		router: $.trim(editFuncUrl.val()),
		seq: $.trim(editFuncSeq.val()),
		level: editFuncLevel.val(),
		type: editFuncType.val(),
		status: editFuncStatus.val(),
	}
	$.ajax({
		url: '/system/edit_function',
		type: 'post',
		data: {func: funcObj},
	})
	.done(function(res) {
		if(res.status == 1){
			$.dialog().success({message: '编辑成功', delay: DELAY_TIME})
			setTimeout(function(){
				getFunctionTree()
			}, DELAY_TIME)
		}else{
			$.dialog().fail({message: '编辑失败，请稍后重试'})
		}
	})
	.fail(function() {
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
  $.dialog().confirm({message: '确定删除<a> '+node.name+' </a>功能？'})
   .on('confirm', function(){
   	  romoveFunctionNode(node.id)
   })
})
function romoveFunctionNode(func_id){
	$.ajax({
		url: '/system/remove_function?id='+func_id,
	})
	.done(function(res) {
		if(res.status == 0){
			$.dialog().error({message: '根节点禁止删除'})
		}else if(res.status == 1){
			$.dialog().success({message: '删除成功', delay: DELAY_TIME})
			setTimeout(function(){
					getFunctionTree()
			}, DELAY_TIME)
		}else{
			$.dialog().error({message: '删除失败, 请稍后重试'})
		}
	})
	.fail(function() {
		console.log("error");
	})
}