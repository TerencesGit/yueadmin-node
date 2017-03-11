/** 部门管理 **/
//部门组织树
const organizeTree = $('#organizeTree');
//角色对应功能节点树
const roleFunctionTree = $('#roleFunctionTree');
//部门对应功能节点树
const orgFunctionTree = $('#orgFunctionTree');
//企业ID
const partnerId = organizeTree.attr('data-id');
//部门ID
const departmentId = $('#departmentId');
//部门名称
const departmentName = $('#departmentName');
//注册员工表单对象
const userForm = $('#userForm');
//弹出框延迟时间
const DELAY_TIME = 800;
//权限列表对象
const roleList = $('#roleList');
//权限单元
const roleItem = roleList.children('li').not('.active');
//权限名称
const roleName = roleList.find('.role');
//员工数据表格
const staffDataTable = $('#staffDataTable');
//标志位
let flag = true;
//部门工具栏对象
const $btnRefresh = $('.btn-refresh'),
	 		$btnPlus = $('.btn-plus'),
		  $btnEdit = $('.btn-edit'),
		  $btnRemove = $('.btn-remove'),
		  $btnCog = $('.btn-cog'),
		  $btnFunc = $('.btn-func'),
		  $btnUnlock = $('.btn-unlock'),
		  $btnBan = $('.btn-ban'),
	    $btnUser = $('.btn-user');
$(function(){
	//页面加载渲染部门树
  renderOrganizeTree(organizeTree);
  //DataTable初始化配置
  staffDataTable.dataTable({
    paging: true,
    searching: true,
    info: true,
    columns: [
      { data: 'index' },
      { data: 'name' },
      { data: 'gender' },
      { data: 'email' },
      { data: 'orgName' },
      { data: 'btn' }
  	]
  });
})
//组织节点点击事件(显示部门名称，并获取该部门下员工)
function HandlerClick(event, treeId, treeNode){
	//组织树对象
  const name = treeNode.name;
  const organizeId = treeNode.id;
  const status= treeNode.status;
  if(status){
  	$btnUnlock.addClass('disabled').parent().addClass('disabled');
  	$btnBan.removeClass('disabled').parent().removeClass('disabled');
  }else{
  	$btnBan.addClass('disabled').parent().addClass('disabled');
  	$btnUnlock.removeClass('disabled').parent().removeClass('disabled');
  }
  departmentName.text(name);
 	departmentId.val(organizeId);
 	//渲染员工列表
 	renderStaffList(organizeId);
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
  	$.dialog().alert({message: '请选择部门！'})
    return false;
  }
 	return node;
}
//刷新操作    
// $btnRefresh.on('click', function(){
// 	renderOrganizeTree(organizeTree)
// })
//新增部门表单
const newOrgModal = $('#newOrgModal'),
	    newOrgTitle = newOrgModal.find('.modal-title'),
	    newOrgName = $('#newOrgName'),
	    newOrgDesc = $('#newOrgDesc'),
	    newOrgBtn = $('#newOrgBtn');

//编辑部门表单
const editOrgModal = $('#editOrgModal'),
			editOrgTitle = editOrgModal.find('.modal-title'),
	    editOrgName = $('#editOrgName'),
	    editOrgDesc = $('#editOrgDesc'),
	    editOrgBtn = $('#editOrgBtn');

//渲染部门树
function renderOrganizeTree(organizeTree){
	var partnerId = organizeTree.attr('data-id');
  $.ajax({
    type: 'get',
    url: '/partner/get_organize_tree?partnerId='+ partnerId,
  })
  .done(function(res){
    var organizes = res.organizes;
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
    organizes.forEach(function(organize){
    	var iconSkin = '';
    	if(!organize.parentId){
    		iconSkin = 'root';
    	}else{
    		iconSkin = 'folder';
    	}
    	treeObj = {
        id: organize.orgId,
        pId: organize.parentId,
        name: organize.name,
        desc: organize.desc,
        status: organize.status,
        open: true,
        iconSkin: iconSkin,
      };
      zNode.push(treeObj)
    })
    $.fn.zTree.init(organizeTree, setting, zNode);
  })
  .fail(function(error){ 
    console.log(error)
  })
}
//DataTable渲染数据
function renderTableData(dataArr) { 
  const table = staffDataTable.dataTable();
  const oSettings = table.fnSettings(); 
  table.fnClearTable(this); 
  dataArr.forEach(function(data){
  	table.oApi._fnAddData(oSettings, data);
  })
  oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
  table.fnDraw();
}
//渲染员工列表
function renderStaffList(organizeId){
  $.ajax({
    url: '/partner/get_organize_staff?organizeId='+ organizeId,
  })
  .done(function(res){
    const users = res.users;
	  const dataArr = [];
	  users.forEach(function(user, index){
	  	const gender = user.gender == '1' ? '女' : '男';
	  	const _user = {
  				"index": index + 1, 
		  		"name": user.name, 
		  		"gender": gender, 
		  		"email": user.email, 
		  		"orgName": user.organize.name, 
		  		"btn": '<a href="/partner/staff_manage" class="btn btn-link">员工管理</a>'
		  	};
	  	dataArr.push(_user)
	  })
	  renderTableData(dataArr)
  })
  .fail(function(error){
    console.log(error)
  })
}
//新增组织节点
$btnPlus.on('click', function(e){
	e.preventDefault();
  if(!getSeletedNode()) return false;
  const node = getSeletedNode();
  newOrgTitle.html('新增<a>'+node.name+'</a>的下属部门');
  $('.btn-reset').click();
  $('.form-group').removeClass('has-success');
})
//新增组织表单提交
newOrgBtn.on('click', function(e){
	e.preventDefault()
	if(!getSeletedNode()) return false;
  const node = getSeletedNode();
	if(!(checkInput(newOrgName) && checkInput(newOrgDesc))) return false;
	const organize = {
		parent_id: node.id,
		name: $.trim(newOrgName.val()),
  	desc: $.trim(newOrgDesc.val())
	}
	if(flag){
		flag = false;
		$.ajax({
			type: 'post',
			url: '/partner/new_organize',
			data: {organize: organize},
		})
		.done(function(res) {
			if(res.status == 1){
				$.dialog().success({message: ''+res.message+'', delay: DELAY_TIME})
				setTimeout(function(){
					renderOrganizeTree(organizeTree)
				}, DELAY_TIME)
			}else if(res.status == 2){
				$.dialog().fail({message: ''+res.message+''});
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
 	const node = getSeletedNode();
 	if(isRoot(node)){
 		editOrgTitle.text('编辑公司名称(仅在组织树上生效)');
 		$('.organize-name').text('公司名称');
 		$('.organize-desc').hide();
 	}else{
 		editOrgTitle.text('部门编辑');
	 	$('.organize-name').text('部门名称');
	 	$('.organize-desc').show();
 	}
 	const name = node.name,
 	      desc = node.desc;
 	editOrgName.val(name);
 	editOrgDesc.val(desc);
 	$('.form-group').removeClass('has-success');
})
//编辑组织表单提交
editOrgBtn.on('click', function(e){
	e.preventDefault()
	if(!getSeletedNode()) return false;
 	const node = getSeletedNode();
	if(!(checkInput(editOrgName) && checkInput(editOrgDesc))) return false;
	const organize = {
		id: node.id,
		name: $.trim(editOrgName.val()),
  	profile: $.trim(editOrgDesc.val())
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
					renderOrganizeTree(organizeTree)
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
//删除组织按钮点击
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
		$.dialog().fail({message: '该部门有下属部门，不可删除！'});
		return false;
	}
	$.dialog().confirm({message: '确定删除<a> '+name+ '</a> ? 此操作不可恢复'})
	.on('confirm', function(){
		removeOrganize(id)
	})
	.on('cancel', function(){
	})
})
//异步删除方法
function removeOrganize(id){
	$.ajax({
		type: 'get',
		url: '/partner/remove_organize?id=' + id,
	})
	.done(function(res){
		if(res.status == 1){
			$.dialog().success({message: '删除成功', delay: DELAY_TIME})
			setTimeout(function(){
				renderOrganizeTree(organizeTree)
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
//设置权限操作
$btnCog.on('click', function(e){
	e.preventDefault()
	if(!getSeletedNode()) return false;
 	var node = getSeletedNode();
  var orgId = node.id;
  roleItem.map(function(index, item){
  	$(item).removeClass('checked')
  })
  getRoleByOrgId(orgId)
})
//权限列表回显
function getRoleByOrgId(orgId){
	$.ajax({
		url: '/partner/get_org_role?id='+ orgId,
	})
	.done(function(res) {
		const orgRoles = res.orgRoles;
		const getRoleId = orgRole => orgRole.role;
		const roleIdList = orgRoles.map(getRoleId);
		for(let i = 0; i < roleItem.length; i++){
			for(let j = 0; j < roleIdList.length; j++){
				if(roleItem[i].getAttribute('data-id') == roleIdList[j]){
					$(roleItem[i]).addClass('checked')
					break;
				}
			}
		}
	})
	.fail(function() {
		console.log("error");
	})
}
//点击权限查看对应功能
roleName.on('click', function(e){
	e.stopPropagation();
	let roleId = $(this).parent().attr('data-id');
	getFuncByRole(roleId)
})

//获取权限对应的功能点
function getFuncByRole(roleId){
  $.ajax({
  	url: '/system/get_role_func?id='+ roleId,
  })
  .done(function(res) {
  	const roleFuncs = res.role_funcs;
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
    var zNode = [];
    var treeObj;
    roleFuncs.forEach(function(role_func){
      treeObj = {
        id: role_func.func._id,
        pId: role_func.func.parent_id,
        name: role_func.func.name,
        open: true
      };
      zNode.push(treeObj)
    })
    $.fn.zTree.init(roleFunctionTree, setting, zNode);
  })
  .fail(function() {
  	console.log("error");
  })
}
//选择权限(选中显示对号，非选中反之)
roleItem.on('click', function(){
	if($(this).hasClass('checked')){
		$(this).removeClass('checked').children('.check').hide()
	}else{
		$(this).addClass('checked').children('.check').show()
	}
})
// 设置权限
$('#setRoleBtn').on('click', function(e){
	e.preventDefault();
	if(!getSeletedNode()) return false;
 	const node = getSeletedNode();
  const orgId = node.id;
	const checkedList = roleList.children('.checked');
	const roleIdList= [];
	checkedList.each(function(index, roleItem){
		roleIdList.push(roleItem.getAttribute('data-id'))
	})
	const org_role = {
		org_id: orgId,
		role_list: roleIdList
	}
	if(flag){
		flag = false;
		$.ajax({
			url: '/partner/set_org_role',
			type: 'POST',
			data: {org_role: org_role},
		})
		.done(function(res) {
			if(res.status == 1){
				$.dialog().success({message: '设置成功', delay: DELAY_TIME})
			}else{
				$.dialog().fail({message: '设置失败, 请稍后重试'})
			}
		})
		.fail(function() {
			console.log("error");
		})
		.always(function(){
			flag = true;
		})
	}
})
//查看功能
$btnFunc.on('click', function(e){
	e.preventDefault();
	if(!getSeletedNode()) return false;
 	const node = getSeletedNode();
  const orgId = node.id;
  const name = node.name;
  getFuncByOrg(orgId);
})

//获取部门所拥有的全部功能
function getFuncByOrg(orgId){
	$.ajax({
		url: '/partner/get_func_by_org?id=' + orgId,
	})
	.done(function(res) {
		const roleFuncs = res.role_funcs;
		if(!roleFuncs) {
			if(orgFunctionTree.next('.alert').length === 0){
				orgFunctionTree.after('<div class="alert alert-info">\
					<i class="fa fa-exclamation-circle"></i>该部门尚未设置权限</div>')
			}
			orgFunctionTree.hide();
			return false;
		}else{
			orgFunctionTree.show().next('.alert').remove();
		}
		const setting = {
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
    roleFuncs.forEach(function(role_func){
      treeObj = {
        id: role_func.func._id,
        pId: role_func.func.parent_id,
        name: role_func.func.name,
        open: true
      };
      zNode.push(treeObj)
    })
    $.fn.zTree.init(orgFunctionTree, setting, zNode);
	})
	.fail(function() {
		console.log("error");
	})
}
//部门启用
$btnUnlock.on('click', function(e){
	e.preventDefault();
	if(!getSeletedNode()) return false;
 	const node = getSeletedNode();
  const orgId = node.id;
  const name = node.name;
  $.dialog().confirm({message: '确定将<a>'+name+'</a>设置为启用状态?'})
	.on('confirm', function(){
		setOrgStatus(orgId, true, $(this))
	})
	.on('cancel', function(){
	})
  console.log(orgId)
})
//部门禁用
$btnBan.on('click', function(e){
	e.preventDefault();
	if(!getSeletedNode()) return false;
 	const node = getSeletedNode();
  const orgId = node.id;
  const name = node.name;
  $.dialog().confirm({message: '确定将<a>'+name+'</a>设置为禁用状态?'})
	.on('confirm', function(){
		setOrgStatus(orgId, false)
	})
	.on('cancel', function(){
	})
})
//设置部门状态
function setOrgStatus(orgId, status){
	status = status ? 1 : 0;
	$.ajax({
		url: '/partner/set_org_status?id='+ orgId+'&&status='+ status,
	})
	.done(function(res) {
		if(res.status == 1){
			$.dialog().success({message: '设置成功', delay: DELAY_TIME})
			if(status){
				setTimeout(function(){
					$btnUnlock.addClass('disabled').parent().addClass('disabled');
					$btnBan.removeClass('disabled').parent().removeClass('disabled');
				}, DELAY_TIME)
			}else{
				setTimeout(function(){
					$btnBan.addClass('disabled').parent().addClass('disabled');
					$btnUnlock.removeClass('disabled').parent().removeClass('disabled');
				}, DELAY_TIME)
			}
		}else{
			$.dialog().fail({message: '设置失败，请稍后重试'})
		}
	})
	.fail(function() {
		console.log("error");
	})
}
//注册员工
$btnUser.on('click', function(e){
	e.preventDefault()
	if(!getSeletedNode()) return false;
 	const node = getSeletedNode();
 	if(departmentId.val() == '') return;
 	userForm.submit()
})