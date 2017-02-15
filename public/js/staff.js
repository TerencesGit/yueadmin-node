/* 员工管理 */
const organizeTree = $('#organizeTree');
//页面加载渲染部门树
$(function(){
  renderTree(organizeTree)
})
//日期选择器
laydate({elem: '#regStartDate', max: laydate.now(-1)});
laydate({elem: '#regEndDate', max: laydate.now(-1)});
//获取被选中的单个节点
function getSeletedNode(){
  var treeObj = $.fn.zTree.getZTreeObj("organizeTree");
  var node = treeObj.getSelectedNodes()[0];
  if(!node){
    $.dialog().alert({message: '请选择部门！'})
    return false;
  }
  return node;
}
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
    url: '/partner/get_organize_tree?partnerId='+ partnerId,
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
//设置部门
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
//设置岗位
const btnTitle = $('.btn-title');
const setTitleBtn = $('#setTitleBtn');
//岗位列表对象
const titleList = $('#titleList');
//岗位单元
const titleItem = titleList.children('li').not('.active');
//岗位名称
const titleName = titleList.find('.title');
var uid;
btnTitle.on('click', function(e){
  e.preventDefault();
  const $tr = $(this).parents('tr');
  uid = $tr.attr('data-id');
})
//选择岗位
titleItem.on('click', function(){
  if($(this).hasClass('checked')){
    $(this).removeClass('checked');
  }else{
    titleItem.removeClass('checked');
    $(this).addClass('checked');
  }
})
//设置岗位

setTitleBtn.on('click', function(e){
  e.preventDefault();
  const checkedTitle = titleList.children('.checked');
  console.log(checkedTitle)
  if(checkedTitle.length === 0){
    $.dialog().alert({message: '请选择岗位'})
    return false;
  }else if(checkedTitle.length === 1){
     var tid = checkedTitle.attr('data-id');
     console.log(tid, uid)
     setStaffTitle(tid, uid)
  }else{
    console.log('error')
  }
})
function setStaffTitle(tid, uid){
  $.ajax({
    url: '/partner/set_staff_title?tid='+ tid +'&&uid='+ uid,
  })
  .done(function(res) {
    console.log(res);
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });
  
}