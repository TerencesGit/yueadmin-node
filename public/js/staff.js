/* 员工管理 */
const organizeTree = $('#organizeTree');
//页面加载渲染部门树
$(function(){
  renderOrgTree(organizeTree)
})
//日期选择器
var start = {
  elem: '#start',
  max: laydate.now(-1),
  choose: function(datas){
     end.min = datas;
     end.start = datas;
  }
};
var end = {
  elem: '#end', 
  max: laydate.now(-1),
  choose: function(datas){
     start.max = datas; 
     start.end = datas;
  }
}
laydate(start);
laydate(end);
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
//渲染组织树
function renderOrgTree(organizeTree){
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
//员工多条件组合查询
const staffForm = $('#staffForm'),
      orgName = $('#orgName'),
      staffName = $('#staffName'),
      staffGender = $('#staffGender'),
      dateStart = $('#start'),
      dateEnd = $('#end'),
      staffEmail = $('staffEmail'),
      searchSubmit = $('#searchSubmit');
searchSubmit.on('click', function(e){
  e.preventDefault()
  if(checkStaffForm() == '0'){
    $.dialog().alert({message: '请输入查询条件'})
  }else{
    staffForm.submit()
  }
})
function checkStaffForm(){
  return isEmptyInput(orgName) || isEmptyInput(staffName) ||
         parseInt(staffGender.val()) || isEmptyInput(dateStart) ||
         isEmptyInput(dateEnd) || isEmptyInput(staffEmail)
}
//设置按钮对象
const btnOrg = $('.btn-org'),
      btnTitle = $('.btn-title'),
      btnStatus = $('.btn-status');
//设置按钮点击获取选中员工
let staffId;
function getSelectedStaff(target){
  const $tr = $(target).parents('tr');
  const id = $tr.attr('data-id');
  const name = $tr.children('.name').text();
  return {id: id, name: name};
}
btnOrg.on('click', function(){
  staffId = getSelectedStaff(this).id;
})
//设置员工部门
const setOrgBtn = $('#setOrgBtn');
setOrgBtn.on('click', function(e){
  e.preventDefault();
  if(!getSeletedNode()) return false;
  const node = getSeletedNode();
  const orgId = node.id;
  if(staffId && orgId){
    setStaffOrg(staffId, orgId)
  }else{
    $.dialog().alert({message: '选择有误，请刷新后重新操作'})
  }
})
function setStaffOrg(staffId, orgId){
  $.ajax({
    url: '/partner/set_staff_org?sid='+ staffId+'&&oid='+ orgId,
  })
  .done(function(res) {
    if(res.status == 1){
      $.dialog().success({message: '设置成功', delay: 1000})
      setTimeout(function(){
        location.replace(location.href)
      }, 1000)
    }else{
      $.dialog().fail({message: '设置失败，请稍后重试'})
    }
  })
  .fail(function() {
    console.log("error");
  })
}
//设置员工岗位
const setTitleBtn = $('#setTitleBtn');
//岗位列表对象
const titleList = $('#titleList');
//岗位单元
const titleItem = titleList.children('li').not('.active');
//岗位名称
const titleName = titleList.find('.title');
//岗位回显
btnTitle.on('click', function(e){
  staffId = getSelectedStaff(this).id;
  getStaffTitle(staffId)
})
function getStaffTitle(sid){
  $.ajax({
    url: '/partner/get_staff_title?sid=' + sid,
  })
  .done(function(res) {
    if(res.status == 1){
      const tid = res.title;
      titleItem.each(function(index, item){
        if($(item).attr('data-id') == tid){
          $(item).addClass('checked')
          return;
        }
      })
    }else{
      console.log('获取岗位失败')
    }
  })
  .fail(function() {
    console.log("error");
  })
}
//选择岗位
titleItem.on('click', function(){
  if($(this).hasClass('checked')){
    $(this).removeClass('checked');
  }else{
    titleItem.removeClass('checked');
    $(this).addClass('checked');
  }
})
//设置员工岗位
setTitleBtn.on('click', function(e){
  e.preventDefault();
  const checkedTitle = titleList.children('.checked');
  if(checkedTitle.length === 0){
    $.dialog().alert({message: '请选择岗位'})
    return false;
  }else if(checkedTitle.length === 1){
     const titleId = checkedTitle.attr('data-id');
     setStaffTitle(titleId, staffId)
  }else{
    console.log('error')
  }
})
function setStaffTitle(tid, sid){
  $.ajax({
    url: '/partner/set_staff_title?tid='+ tid +'&&sid='+ sid
  })
  .done(function(res) {
    if(res.status == 1){
      $.dialog().success({message: '设置成功', delay: 1000})
      setTimeout(function(){
        location.replace(location.href)
      }, 1000)
    }else{
      $.dialog().fail({message: '设置失败，请稍后重试'})
    }
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });
}
//设置员工状态
btnStatus.on('click', function(e){
  staffId = getSelectedStaff(this).id;
  let name = getSelectedStaff(this).name;
  const status = parseInt($(this).attr('data-id'));
  const info = status ? '禁用状态' : '启用状态';
  $.dialog().confirm({message: '确定要将<a>'+name+'</a>设置为'+info})
   .on('confirm', function(){
    setStaffStatus(staffId, status)
   })
})
function setStaffStatus(sid, status){
  $.ajax({
    url: '/partner/set_staff_status?sid='+ sid+'&&status='+status,
  })
  .done(function(res) {
    if(res.status == 1){
      $.dialog().success({message: '设置成功', delay: 1000})
      setTimeout(function(){
        location.replace(location.href)
      }, 1000)
    }else{
      $.dialog().fail({message: '设置失败，请稍后重试'})
    }
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });
  
}