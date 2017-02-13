/* 员工管理 */
//页面加载渲染部门树
$(function(){
  renderTree(organizeTree)
})
//组织节点点击事件
function HandlerClick(event, treeId, treeNode){
  var name = treeNode.name;
  $('#departmentName').text(name);
  var organizeId = treeNode.id;
  $('#orgId').val(organizeId);
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
  })
  .fail(function(error){ 
    console.log(error)
  })
}
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