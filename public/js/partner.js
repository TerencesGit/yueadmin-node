//企业注册表单对象
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
			previewArea = $('.preview-area'),
			fileControl = $('.file-control'),
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
			tip: '员工姓名只能是中文或英文',
			required: '请输入姓名',
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
			tip: '验证邮箱后，可用于邮箱登录和密码找回',
			required: '请输入邮箱',
			regular: '邮箱格式不正确',
			existed: '该邮箱号已被占用'
		},
		password: {
      tip: '密码长度为8-20位',
      required: '请输入密码',
      regular: '密码长度为8-20位',
    },
    confirmPasswd: {
    	tip: '请再次输入密码',
    	inconsistent: '两次密码输入不一致'
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
//点击选择本地图片
previewArea.on('click', function(e){
   $(this).parents('.form-group').find('.file-control').click()
})
//图片预览
fileControl.change(function(e){
  const picPreview = $(this).parents('.form-group').find('.pic-preview');
  checkImage(this) && uploadPreview(this, picPreview)
  picPreview.parent().addClass('show');
})

//企业信息编辑
const partnerForm = $('#partnerForm'),
      savePratnerBtn = $('#savePratnerBtn');
savePratnerBtn.on('click', function(e){
	e.preventDefault();
  checkPartnerForm() && partnerForm.submit()
})   

//用户代注册表单
const agentRegForm = $('#agentRegForm'),
      userName = $('#userName'),
      userEmail = $('#userEmail'),
      userPasswd = $('#userPasswd'),
      confirmPasswd = $('#confirmPasswd'),
      agentRegBtn = $('#agentRegBtn');
agentRegBtn.on('click', function(e){
  e.preventDefault();
  var status = $(this).attr('data-status');
  if(status == 0) return;
  checkRegForm() && agentRegForm.submit()
})
//输入框焦点事件
focusEvent(userName, msg.name, regular.name, validateForm);
focusEvent(userPasswd, msg.password, regular.password, validateForm);
focusEvent(confirmPasswd, msg.confirmPasswd, regular.password, checkConsistency, userPasswd);
userEmail.focus(function(){
	if($.trim($(this).val()) == ''){
    onFocus($(this), msg.email)
  }
})
let _tempEmail;
userEmail.blur(function(){
	const value = $.trim($(this).val());
	if(value == ''){
		clearTip($(this))
		return;
	}
	if(_tempEmail == value) return;
	_tempEmail = value;
	validateForm(userEmail, msg.email, regular.email) &&
	queryEmail(userEmail, msg.email, agentRegBtn, 'null')
})
userEmail[0].oninput = function(){
  onFocus($(this), msg.email)
}
//用户代注册表单校验
function checkRegForm(){
	return validateForm(userName, msg.name, regular.name) &&
  validateForm(userEmail, msg.email, regular.email) &&
  validateForm(userPasswd, msg.password, regular.password) &&
  checkConsistency(confirmPasswd, userPasswd, msg.confirmPasswd)
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