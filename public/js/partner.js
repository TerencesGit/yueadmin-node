//企业信息表单对象
const registeredForm = $('#registeredForm'),
			partnerName = $('#partnerName'),
			corporation = $('#corporation'),
			licenseId = $('#licenseId'),
			contactName = $('#contactName'),
			address = $('#address'),
			postcode = $('#postcode'),
			contactTelephone = $('#contactTelephone'),
			contactMobile = $('#contactMobile'),
			partnerEmail = $('#partnerEmail'),
			profile = $('#profile'),
			logoFile = $('#logoFile'),
			logoPreview = $('#logoPreview'),
			logoPic = $('#logoPic'),
			licenseFile = $('#licenseFile'),
			licensePreview = $('#licensePreview'),
			licensePic = $('#licensePic'),
			btnRegistered = $('#btnRegistered');

//正则表达式   
const regular = {
			name: /^[\u4E00-\u9FA5A-Za-z]+$/,
		  email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		  mobile: /^(13|14|15|17|18)[0-9]{9}$/, 
		  telephone: /\d{3}-\d{8}|\d{4}-\d{7}/,
		  address: /[\u4e00-\u9fa5]/,
		  post: /[1-9]\d{5}(?!\d)/,
		  licenseId: /\d{15}/,
		  password: /^.{8,20}$/,
}
//错误信息提示			
const msg = {
		name: {
			required: '请输入员工姓名',
			regular: '姓名只能是中文或英文'
		},
		licenseId: {
			regular: '营业执照注册号为15位数字'
		},
		address: {
			regular: '地址必须包含中文'
		},
		post: {
			regular: '邮编格式有误'
		},
		telephone: {
			regular: '电话号码格式错误'
		},
		mobile: {
			regular: '手机号码格式错误'
		},
		email: {
			required: '请输入邮箱',
			regular: '邮箱格式不正确',
			existed: '该邮箱号已被占用'
		},
		password: {
      required: '请输入密码',
      regular: '密码长度在8-20位之间',
      notMatch: '两次密码输入不一致'
    }
}			
btnRegistered.on('click', function(e){
	e.preventDefault()
	checkInput(partnerName) &&
	checkPartnerForm() &&
	checkImage(logoFile) &&
	checkImage(licenseFile) &&
	registeredForm.submit()
})		

//企业信息表单验证		
function checkPartnerForm(){
	return checkInput(corporation, msg.name, regular.name) &&
	checkInput(licenseId, msg.licenseId, regular.licenseId) && 
	checkInput(contactName, msg.name, regular.name) &&
	checkInput(address, msg.address, regular.address) &&
	checkInput(postcode, msg.post, regular.post) && 
	checkInputValue(contactTelephone, msg.telephone, regular.telephone) &&
	checkInputValue(contactMobile, msg.mobile, regular.mobile) &&
	checkInputValue(partnerEmail, msg.email, regular.email)
}
//企业Logo预览
logoPreview.on('click', function(){
	logoFile.click()
})
logoFile.change(function(){
  checkImage(this) && uploadPreview(this, logoPic)
})
//企业营业执照预览
licensePreview.on('click', function(){
	licenseFile.click()
})
licenseFile.change(function(){
  checkImage(this) && uploadPreview(this, licensePic)
})

//企业信息编辑
const partnerForm = $('#partnerForm'),
      savePratnerBtn = $('#savePratnerBtn');
   
savePratnerBtn.on('click', function(e){
	e.preventDefault();
  checkPartnerForm() && partnerForm.submit()
})   

//企业代注册表单
const agentRegForm = $('#agentRegForm'),
      userName = $('#userName'),
      userEmail = $('#userEmail'),
      userPasswd = $('#userPasswd'),
      confirmPasswd = $('#confirmPasswd'),
      agentRegBtn = $('#agentRegBtn');
agentRegBtn.on('click', function(e){
  e.preventDefault();
  var status = $(this).attr('data-status');
  if(status == '0') return;
  checkRegForm() && agentRegForm.submit()
})
//用户代注册表单校验
function checkRegForm(){
	return checkInput(userName, msg.name, regular.name) &&
  checkInput(userEmail, msg.email, regular.email) &&
  checkInput(userPasswd, msg.password, regular.password) &&
  confirmConsistent(confirmPasswd, userPasswd, msg.password)
}
//为输入框注册失去焦点事件
userName.blur(function(e){
	checkInput(userName, msg.name, regular.name)
})
userEmail.blur(function(e){
	checkInput(userEmail, msg.email, regular.email) &&
	queryAccount(userEmail, 'findByEmail', msg.email, agentRegBtn)
})
userPasswd.blur(function(e){
	checkInput(userPasswd, msg.password, regular.password)
})
userPasswd.blur(function(e){
	checkInput(userPasswd, msg.password, regular.password)
	if(confirmPasswd.val() !== ''){
		confirmConsistent(confirmPasswd, userPasswd, msg.password)
	}
})
confirmPasswd.blur(function(e){
	if(userPasswd.val() !== '' && confirmPasswd.val() !== '') {
    confirmConsistent(confirmPasswd, userPasswd, msg.password)
  }
})
/* 岗位管理 */
const $btnEdit = $('.btn-edit'),
			$btnRemove = $('.btn-remove');
//新增岗位表单
const newTitleForm = $('#newTitleForm'),
			titleName = $('#titleName'),
			titleDesc = $('#titleDesc'),
			newTitleBtn = $('#newTitleBtn');
newTitleBtn.on('click', function(e){
	e.preventDefault();
	if(simpleCheckInput(titleName) && simpleCheckInput(titleDesc)){
		newTitleForm.submit()
	}else{
		return false;
	}
})	
//编辑岗位表单	
const editTitleForm = $('#editTitleForm'),
			editTitleId = $('#editTitleId'),
			editTitleName = $('#editTitleName'),
			editTitleDesc = $('#editTitleDesc'),
			editTitleBtn = $('#editTitleBtn');
//岗位信息回显
$btnEdit.on('click', function(e){
	var $tr = $(this).parents('tr');
	var id = $tr.attr('data-id'),
      name = $tr.find('.title-name').text(),
      desc = $tr.find('.title-desc').text();
  editTitleId.val(id);
  editTitleName.val(name);
  editTitleDesc.val(desc);
})
///编辑岗位提交			
editTitleBtn.on('click', function(e){
	e.preventDefault();
	if(simpleCheckInput(editTitleName) && simpleCheckInput(editTitleDesc)){
		editTitleForm.submit()
	}else{
		return false;
	}
})	
//删除岗位
$btnRemove.on('click', function(req, res){
	var $tr = $(this).parents('tr');
	var id = $tr.attr('data-id'),
			name = $tr.find('.title-name').text();
	$.dialog().confirm({message: '确定删除 '+name+ ' ? 此操作不可恢复'})
	.on('confirm', function(){
		removeTitle(id, $tr)
	})
	.on('cancel', function(){
	})
})
function removeTitle(id, $tr){
	$.ajax({
		url: '/partner/remove_title?id='+ id,
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
		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	
}
//商家信息审核表单
var verifiedPartnerForm = $('#verifiedPartnerForm'),
		rejectInfo = $('#rejectInfo'),
		btnVerified = $('#btnVerified');
btnVerified.on('click', function(e){
	e.preventDefault()
	if($.trim(rejectInfo.val()).length >= 5){
		verifiedPartnerForm.submit()
	}else{
		console.log($.trim(rejectInfo.val()).length)
		rejectInfo.parents('.form-group').addClass('has-error')
	}
})
rejectInfo.focus(function(){
	$(this).parents('.form-group').removeClass('has-error')
})