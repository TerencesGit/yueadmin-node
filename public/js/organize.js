const organizeTree = $('#organizeTree');
const partnerId = organizeTree.attr('data-id');
$(function(){
  renderTree(organizeTree)
})
//组织节点点击事件
function HandlerClick(event, treeId, treeNode){
  var name = treeNode.name;
  $('#departmentName').text(name);
  var organizeId = treeNode.id;
 	renderStaff(organizeId);
}
//判断父节点
function isParent(treeNode){
	return treeNode.isParent;
}
//获取被选中的单个节点
function getSeletedNode(){
	var treeObj = $.fn.zTree.getZTreeObj("organizeTree");
  var node = treeObj.getSelectedNodes()[0];
  if(!node){
    alert('请选择要操作的部门！');
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
    	selectedMulti: false,
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
    var treeObj = $.fn.zTree.getZTreeObj("organizeTree");
		var nodes = treeObj.getNodes();
		if (nodes.length > 0) {
			treeObj.selectNode(nodes[0]);
		}
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
    var users = result.users;
    var tbodyHtml = '';
    for(let i = 0; i < users.length; i++){
      var num = i+1;
      var gender = users[i].gender == '1' ? '女' : '男';
      tbodyHtml += ('<tr><td>'+num+'</td><td>'+users[i].name+'</td>\
        <td>'+gender+'</td><td>'+users[i].mobile+'</td>\
        <td>'+users[i].email+'</td><td>'+users[i].organize.name+'</td>\
        <td><a href="/partner/staff_manage" class="btn btn-warning">编辑</a></td></tr>')
    }
    $('.staff-list').empty()
    $('.staff-list').append(tbodyHtml)
  })
  .fail(function(error){
    console.log(error)
  })
}

//部门操作工具栏按钮
var $btnRefresh = $('.btn-refresh'),
 		$btnNew = $('.btn-new'),
	  $btnEdit = $('.btn-edit'),
	  $btnRemove = $('.btn-remove');

//刷新操作    
$btnRefresh.on('click', function(){
	renderTree(organizeTree)
})
//组织树表单模态框
var organizeModal = $('#organizeModal'),
    modalTitle = organizeModal.find('.modal-title'),
    modalFooter = organizeModal.find('.modal-footer');
var organizeName = $('#organizeName'),
    organizeProfile = $('#organizeProfile');
//信息提示    
var msg = {
	required: '名称不能为空'
}
//新增组织节点
$btnNew.on('click', function(e){
	e.preventDefault();
  if(!getSeletedNode()) return false;
  var node = getSeletedNode();
  modalTitle.html('新增<a>'+node.name+'</a>的下属部门');
  organizeName.val('');
  organizeProfile.val('');
  if(organizeModal.find('#editTreeBtn').length > 0){
  	$('#editTreeBtn').remove()
  }
  if(organizeModal.find('#newTreeBtn').length === 0){
  	var newTreeBtn = $('<button id="newTreeBtn" class="btn btn-success" data-dismiss="modal">提交</button>');
  	newTreeBtn.appendTo(modalFooter);
  }
  $('#newTreeBtn').on('click', function(e){
		e.preventDefault()
		if(!checkInput(organizeName, msg)) return false;
		var organize = {
			parent_id: node.id,
			name: $.trim(organizeName.val()),
	  	profile: $.trim(organizeProfile.val())
		}
		$.ajax({
			type: 'post',
			url: '/partner/new_organize',
			data: {organize: organize},
		})
		.done(function(res) {
			console.log(res)
			if(res.status == 1){
				$.dialog({type: 'success', message: '添加成功', delay: 2000})
				setTimeout(function(){
					renderTree(organizeTree)
				}, 2000)
			}else if(res.status == 2){
				$.dialog({type: 'warning', message: '添加失败', delay: 2000})
			}
		})
		.fail(function(err) {
			console.log(err);
		})
	})
})
//修改组织节点
$btnEdit.on('click', function(e){
	e.preventDefault();
  if(!getSeletedNode()) return false;
 	var node = getSeletedNode();
 	var name = node.name,
 	    profile = node.profile;
 	modalTitle.text('部门编辑');
 	organizeName.val(name);
 	organizeProfile.val(profile);
  if(organizeModal.find('#newTreeBtn').length > 0){
  	$('#newTreeBtn').remove()
  }
  if(organizeModal.find('#editTreeBtn').length === 0){
  	var editTreeBtn = $('<button id="editTreeBtn" class="btn btn-success" data-dismiss="modal">提交</button>');
  	editTreeBtn.appendTo(modalFooter);
  }
  $('#editTreeBtn').on('click', function(e){
		e.preventDefault()
		if(!checkInput(organizeName, msg)) return false;
		var organize = {
			id: node.id,
			name: $.trim(organizeName.val()),
	  	profile: $.trim(organizeProfile.val())
		}
		$.ajax({
			type: 'post',
			url: '/partner/edit_organize',
			data: {organize: organize},
		})
		.done(function(res) {
			console.log(res)
			if(res.status == 1){
				$.dialog({type: 'success', message: '编辑成功', delay: 2000})
				setTimeout(function(){
					renderTree(organizeTree)
				}, 2000)
			}else if(res.status == 2){
				$.dialog({type: 'warning', message: '编辑失败', delay: 2000})
			}
		})
		.fail(function(err) {
			console.log(err);
		})
	})
})
//删除组织节点
$btnRemove.on('click', function(e){
	e.preventDefault();
	if(!getSeletedNode()) return false;
	var node = getSeletedNode();
	var id = node.id,
	    name = node.name;
	if(isParent(node)){
		alert('该部门有下属部门，不可删除！');
		return false;
	}
	if(confirm('确定删除 '+name+ ' ?此操作不可恢复')){
		$.ajax({
			type: 'get',
			url: '/partner/remove_organize?id=' + id,
		})
		.done(function(res){
			if(res.status == 1){
				$.dialog({type: 'success', message: '删除成功', delay: 2000})
				setTimeout(function(){
					renderTree(organizeTree)
				}, 2000)
			}else if(res.status == 2){
				$.dialog({type: 'warning', message: '该部门有下属部门，不可删除', delay: 2000})
			}else if(res.status == 3){
				$.dialog({type: 'warning', message: '该部门有员工，不可删除', delay: 2000})
			}else if(res.status == 0){
				$.dialog({type: 'warning', message: '企业节点禁止删除', delay: 2000})
			}else{
				$.dialog({type: 'warning', message: '删除失败，请稍后重试', delay: 2000})
			}
		})
		.fail(function(error){
			console.log(error)
		})
	}
})

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