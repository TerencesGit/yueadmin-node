$(function(){
  var partnerId = $('#organizeTree').attr('data-id');
  $.ajax({
    type: 'get',
    url: '/partner/getDepartmentTree?partnerId='+ partnerId,
  })
  .done(function(result){
    var organizes = result.organizes;
    var users = result.users;
    //渲染组织树
    var zNode = [];
    for(let i = 0; i <organizes.length; i++){
      var obj = {
        id: organizes[i]._id,
        pId: organizes[i].parent_id,
        name: organizes[i].name,
        profile: organizes[i].profile,
        open: true
      };
      zNode.push(obj)
    }
    // zTree配置
		var setting = {
		 // view: {
	   //      addHoverDom: addHoverDom,
	   //      removeHoverDom: removeHoverDom,
	   //      selectedMulti: true
	   //    },
	   //    edit: {
	   //      enable: true,
	   //      showRenameBtn: showRenameBtn,
	   //      showRemoveBtn: showRemoveBtn,
	   //      drag: {
	   //        isMove: true
	   //      }
	   //    },
		  data: {
		    simpleData: {
		      enable: true
		    }
		  },
		  callback: {
		    beforeRemove: beforeRemove,
		    beforeRename: beforeRename,
		    onCheck: triggerEvent,
		    onRemove: triggerEvent,
		    onRename: triggerEvent,
		    onDrop: triggerEvent,
		    onNodeCreated: triggerEvent,
		    onClick: HandlerClick,
		  }
		}
    $.fn.zTree.init($('#organizeTree'), setting, zNode);

    //渲染员工列表
    var tbodyHtml;
    for(let i = 0; i < users.length; i++){
      var num = i+1;
      var gender = users[i].gender == '1' ? '女' : '男';
      tbodyHtml += ('<tr><td>'+num+'</td><td>'+users[i].name+'</td>\
        <td>'+gender+'</td><td>'+users[i].mobile+'</td>\
        <td>'+users[i].email+'</td><td>'+users[i].address+'</td>\
        <td><button class="btn btn-warning btn-sm">编辑</button></td></tr>')
    }
    $('.staff-list').append(tbodyHtml)
  })
  .fail(function(error){
    console.log(error)
  })
})

function beforeRemove(treeId, treeNode) {
  var zTree = $.fn.zTree.getZTreeObj("organizeTree");
  zTree.selectNode(treeNode);
  return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
}
function beforeRename(treeId, treeNode, newName, isCancel) {
  if (newName.length === 0) {
    setTimeout(function() {
      var zTree = $.fn.zTree.getZTreeObj("organizeTree");
      zTree.cancelEditName();
      alert("节点名称不能为空");
    }, 0);
    return false;
  }
  return true;
}
var newCount = 1;
function addHoverDom(treeId, treeNode) {
  var sObj = $("#" + treeNode.tId + "_span");
  if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
  var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
    + "' title='add node' onfocus='this.blur();'></span>";
  sObj.after(addStr);
  var btn = $("#addBtn_"+treeNode.tId);
  if (btn) btn.bind("click", function(){
    var zTree = $.fn.zTree.getZTreeObj("organizeTree");
    zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, name:"new node" + (newCount++)});
    return false;
  });
};
function removeHoverDom(treeId, treeNode) {
  $("#addBtn_"+treeNode.tId).unbind().remove();
};
function showRenameBtn(treeId, treeNode){
  return treeNode.isLastNode;
}
function showRemoveBtn(treeId, treeNode){
  return !treeNode.isParent;
}
function triggerEvent(event, treeId, treeNode){
  $('#output').val(window.JSON.stringify(treeNode))
}
//判断是否是父节点
function isParent(treeNode){
	return treeNode.isParent;
}
//判断是否有节点被选中
function isSeletedNodes(){
	var treeObj = $.fn.zTree.getZTreeObj("organizeTree");
  var nodes = treeObj.getSelectedNodes();
  if(!nodes[0]){
    alert('没有被选中的节点！')
    return false;
  }
 	return nodes[0];
}
//刷新组织树
function refreshTree(){
	var treeObj = $.fn.zTree.getZTreeObj("organizeTree");
	treeObj.refresh();
}

//点击部门节点显示对应信息
function HandlerClick(event, treeId, treeNode){
  var name = treeNode.name;
  $('#departmentName').text(name)
}
// 部门操作工具栏按钮
var $btnRefresh = $('.btn-refresh'),
 		$btnNew = $('.btn-new'),
	  $btnEdit = $('.btn-edit'),
	  $btnRemove = $('.btn-remove');

//组织部门表单
var organizeForm = $('#organizeForm'),
		orgParentId = $('#orgParentId'),
		organizeId = $('#organizeId'),
    organizeName = $('#organizeName'),
    organizeProfile = $('#organizeProfile'),
    organizeSubmitBtn = $('#organizeSubmitBtn');
$btnRefresh.on('click', function(){
	refreshTree()
})
//新增按钮
$btnNew.on('click', function(){
  if(!isSeletedNodes()) return false;
  var node = isSeletedNodes();
  orgParentId.val(node.id);
  organizeId.val('');
  organizeName.val('');
  organizeProfile.val('');
  $('.modal-title').text('新增'+node.name+'的下属部门');
})
//编辑按钮
$btnEdit.on('click', function(){
  if(!isSeletedNodes()) return false;
 	var node = isSeletedNodes();
 	$('.modal-title').text('部门编辑');
  orgParentId.val('');
  organizeId.val(node.id);
  organizeName.val(node.name);
  organizeProfile.val(node.profile);
})

//组织部门表单提交
organizeSubmitBtn.on('click', function(e){
  e.preventDefault();
  if($.trim(organizeName.val()) == ''){
    organizeName.parents('.form-group').addClass('has-error')
  }else{
    organizeForm.submit()
  }
})
//删除组织部门
$btnRemove.on('click', function(){
	if(!isSeletedNodes()) return false;
	var node = isSeletedNodes();
	if(!isParent(node)){
		$.ajax({
			type: 'get',
			url: '/partner/remove_organize?id=' + node.id
		})
		.done(function(result){
			if(result.status == 1){
				$.dialog({type: 'success', message: '删除成功', delay: 2000})
				setTimeout(function(){
					var treeObj = $.fn.zTree.getZTreeObj("organizeTree");
					treeObj.removeNode(node);
				}, 2000)
			}
			if(result.status == 2){
				$.dialog({type: 'warning', message: '该部门有员工，不可删除', delay: 2000})
			}
		})
		.fail(function(error){
			console.log(error)
		})
	}else{
		alert('该部门有下属部门，不可删除！')
	}
})