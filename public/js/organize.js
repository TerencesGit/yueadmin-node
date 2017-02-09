const organizeTree = $('#organizeTree');
const partnerId = organizeTree.attr('data-id');
let isFirst = true;
let flag = true;

$(function(){
  renderTree(organizeTree)
})
//组织节点点击事件
function HandlerClick(event, treeId, treeNode){
  var name = treeNode.name;
  $('#departmentName').text(name);
  var organizeId = treeNode.id;
 	renderStaff(organizeId);
 	$('#orgId').val(organizeId);
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
	var treeObj = $.fn.zTree.getZTreeObj("organizeTree");
  var node = treeObj.getSelectedNodes()[0];
  if(!node){
  	$.dialog().alert({message: '请选择要操作的部门！'})
    //alert('请选择要操作的部门！');
    return false;
  }
 	return node;
}
//渲染组织树
function renderTree(organizeTree){
	var partnerId = organizeTree.attr('data-id');
  $.ajax({
    type: 'get',
    url: '/partner/getOrganizeTree?partnerId='+ partnerId,
  })
  .done(function(result){
    var organizes = result.organizes;
    var setting = {
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
    for(let i = 0; i <organizes.length; i++){
      treeObj = {
        id: organizes[i]._id,
        pId: organizes[i].parent_id,
        name: organizes[i].name,
        profile: organizes[i].profile,
        open: true
      };
      zNode.push(treeObj)
    }
    $.fn.zTree.init(organizeTree, setting, zNode);
    //仅在加载页面时执行
   //  if(isFirst){
   //  	isFirst = false;
   //  	let treeObj = $.fn.zTree.getZTreeObj("organizeTree");
			// let nodes = treeObj.getNodes();
			// if (nodes.length > 0) {
			// 	treeObj.selectNode(nodes[0]);
			// }
			// if(getSeletedNode){
			// 	let organizeId = getSeletedNode().id;
			// 	renderStaff(organizeId)
			// }
   //  }
  })
  .fail(function(error){ 
    console.log(error)
  })
}
//渲染员工列表
function renderStaff(organizeId){
  $.ajax({
    type: 'get',
    url: '/partner/get_organize_staff?organizeId='+ organizeId,
  })
  .done(function(result){
    let users = result.users;
    let staffList = '';
    for(let i = 0; i < users.length; i++){
      let num = i+1;
      let gender = users[i].gender == '1' ? '女' : '男';
      staffList += ('<tr><td>'+num+'</td><td>'+users[i].name+'</td>\
        <td>'+gender+'</td><td>'+users[i].mobile+'</td>\
        <td>'+users[i].email+'</td><td>'+users[i].organize.name+'</td>\
        <td><a href="/partner/staff_manage" class="btn btn-link">设置</a></td></tr>')
    }
    $('.staff-list').empty().append(staffList);
  })
  .fail(function(error){
    console.log(error)
  })
}

//部门操作工具栏按钮
var $btnRefresh = $('.btn-refresh'),
 		$btnNew = $('.btn-new'),
	  $btnEdit = $('.btn-edit'),
	  $btnRemove = $('.btn-remove'),
	  $btnCog = $('.btn-cog'),
    $btnStaff = $('.btn-new-staff');

//刷新操作    
$btnRefresh.on('click', function(){
	renderTree(organizeTree)
})
//新增组织模态框表单
var newOrganizeModal = $('#newOrganizeModal'),
    newModalTitle = newOrganizeModal.find('.modal-title'),
    newOrganizeName = $('#newOrganizeName'),
    newOrganizeProfile = $('#newOrganizeProfile'),
    newOrganizeBtn = $('#newOrganizeBtn');

//编辑组织模态框表单
var editOrganizeModal = $('#editOrganizeModal'),
		editModalTitle = editOrganizeModal.find('.modal-title'),
    editOrganizeName = $('#editOrganizeName'),
    editOrganizeProfile = $('#editOrganizeProfile'),
    editOrganizeBtn = $('#editOrganizeBtn');

//信息提示    
var msg = {
	required: '名称不能为空'
}
//弹出框延迟时间
const DELAY_TIME = 800;

//新增组织节点
$btnNew.on('click', function(e){
	e.preventDefault();
  if(!getSeletedNode()) return false;
  var node = getSeletedNode();
  newModalTitle.html('新增<a>'+node.name+'</a>的下属部门');
  newOrganizeName.val('');
  newOrganizeProfile.val('');
})

//新增组织表单提交
newOrganizeBtn.on('click', function(e){
	e.preventDefault()
	if(!getSeletedNode()) return false;
  var node = getSeletedNode();
	if(!checkInput(newOrganizeName, msg)) return false;
	var organize = {
		parent_id: node.id,
		name: $.trim(newOrganizeName.val()),
  	profile: $.trim(newOrganizeProfile.val())
	}
	if(flag){
		flag = false;
		$.ajax({
			type: 'post',
			url: '/partner/new_organize',
			data: {organize: organize},
		})
		.done(function(res) {
			console.log(res)
			if(res.status == 1){
				$.dialog({type: 'success', message: '添加成功', delay: DELAY_TIME})
				setTimeout(function(){
					renderTree(organizeTree)
				}, DELAY_TIME)
			}else if(res.status == 2){
				$.dialog({type: 'warning', message: '添加失败', delay: DELAY_TIME})
			}
			flag = true;
		})
		.fail(function(err) {
			console.log(err);
		})
	}
})
//编辑组织节点
$btnEdit.on('click', function(e){
	e.preventDefault();
  if(!getSeletedNode()) return false;
 	var node = getSeletedNode();
 	if(isRoot(node)){
 		editModalTitle.text('编辑公司名称(仅在组织树上生效)');
 		$('.organize-name').text('公司名称');
 		$('.organize-profile').hide();
 	}else{
 		editModalTitle.text('部门编辑');
	 	$('.organize-name').text('部门名称');
	 	$('.organize-profile').show();
 	}
 	var name = node.name,
 	    profile = node.profile;
 	editOrganizeName.val(name);
 	editOrganizeProfile.val(profile);
})
//编辑组织表单提交
editOrganizeBtn.on('click', function(e){
	e.preventDefault()
	if(!getSeletedNode()) return false;
 	var node = getSeletedNode();
	if(!checkInput(editOrganizeName, msg)) return false;
	var organize = {
		id: node.id,
		name: $.trim(editOrganizeName.val()),
  	profile: $.trim(editOrganizeProfile.val())
	}
	if(flag){
		$.ajax({
			type: 'post',
			url: '/partner/edit_organize',
			data: {organize: organize},
		})
		.done(function(res) {
			console.log(res)
			if(res.status == 1){
				$.dialog().success({message: '编辑成功', delay: DELAY_TIME})
				setTimeout(function(){
					renderTree(organizeTree)
				}, DELAY_TIME)
			}else if(res.status == 2){
				$.dialog().fail({message: '编辑失败'})
			}
			flag = true;
		})
		.fail(function(err) {
			console.log(err);
		})
	}
})
//删除组织节点
$btnRemove.on('click', function(e){
	e.preventDefault();
	if(!getSeletedNode()) return false;
	var node = getSeletedNode();
	var id = node.id,
	    name = node.name;
	if(isRoot(node)){
		$.dialog().alert({message: '企业节点不可删除！'});
		return false;
	}
	if(isParent(node)){
		$.dialog().alert({message: '该部门有下属部门，不可删除！'});
		return false;
	}
	$.dialog().confirm({message: '确定删除 '+name+ ' ? 此操作不可恢复'})
	.on('confirm', function(){
		removeOrganize(id)
	})
	.on('cancel', function(){
	})
})
function removeOrganize(id){
	$.ajax({
		type: 'get',
		url: '/partner/remove_organize?id=' + id,
	})
	.done(function(res){
		if(res.status == 1){
			$.dialog().success({message: '删除成功', delay: DELAY_TIME})
			setTimeout(function(){
				renderTree(organizeTree)
			}, DELAY_TIME)
		}else if(res.status == 2){
			$.dialog().fail({message: '该部门有下属部门，不可删除'})
		}else if(res.status == 3){
			$.dialog().fail({message: '该部门有员工，不可删除'})
		}else if(res.status == 0){
			$.dialog().fail({message: '企业节点禁止删除'})
		}else{
			$.dialog().fail({message: '删除失败，请稍后重试'})
		}
	})
	.fail(function(error){
		console.log(error)
	})
}
/* 员工操作 */

//设置员工部门
var setOrganizeForm = $('#setOrganizeForm'),
    userId = $('#userId'),
    orgId = $('#organizeId'),
    setOrganizeBtn = $('#setOrganizeBtn');
$('.btn-set').on('click', function(){
  var $tr = $(this).parents('tr');
  var userid = $tr.attr('data-id');
  userId.val(userid);
})

//提交按钮
setOrganizeBtn.on('click', function(e){
  e.preventDefault();
  if(!getSeletedNode()) return false;
  var node = getSeletedNode();
  orgId.val(node.id);
  setOrganizeForm.submit()
})

//设置权限
$btnCog.on('click', function(e){
	e.preventDefault()
	if(!getSeletedNode()) return false;
 	var node = getSeletedNode();

})
var roleList = $('#roleList');
var roleItem = roleList.children('li');
var roleName = roleList.find('.role');
roleName.on('click', function(e){
	e.stopPropagation();
	var roleId = $(this).attr('data-id');
	console.log(roleId)
	getFunctionTree()
})
//获取角色对应的功能点
function getFuncByRole(roleId){
  $.ajax({
  	url: '/partner/get_function_tree?id='+ roleId,
  })
  .done(function(res) {
  	console.log("success");
  })
  .fail(function() {
  	console.log("error");
  })
}
const functionTree = $('#functionTree');
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
roleItem.on('click', function(){
	if($(this).hasClass('checked')){
		$(this).removeClass('checked').children('.check').hide()
	}else{
		$(this).addClass('checked').children('.check').show()
	}
})
$btnStaff.on('click', function(e){
	e.preventDefault()
	if(!getSeletedNode()) return false;
 	var node = getSeletedNode();
 	if($('#orgId').val() == '') return;
 	$('#regStaffForm').submit()
})