/* 注册企业 */

//注册企业表单对象
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
		partnerName: /^[\u4E00-\u9FA5A-Za-z0-9]+$/,
		name: /^[\u4E00-\u9FA5A-Za-z]+$/,
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    mobile: /^(13|14|15|17|18)[0-9]{9}$/, 
    telephone: /\d{3}-\d{8}|\d{4}-\d{7}/,
    address: /[\u4e00-\u9fa5]/,
    post: /[1-9]\d{5}(?!\d)/,
    licenseId: /\d{15}/,
}
//错误信息提示			
const msg = {
	partnerName: {
		required: '企业名称必填',
		regular: '企业名称不能包含特殊字符'
	},
	name: {
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
		regular: '邮箱格式不正确'
	},
}			
btnRegistered.on('click', function(e){
	e.preventDefault()
	registerSubmit()
})			
function registerSubmit(){
	checkInput(partnerName, msg.partnerName, regular.partnerName) &&
	checkInput(corporation, msg.name, regular.name) &&
	checkInput(licenseId, msg.licenseId, regular.licenseId) && 
	checkInput(contactName, msg.name, regular.name) &&
	checkInput(address, msg.address, regular.address) &&
	checkInput(postcode, msg.post, regular.post) && 
	checkNoEmptyInput(contactTelephone, msg.telephone, regular.telephone) &&
	checkNoEmptyInput(contactMobile, msg.mobile, regular.mobile) &&
	checkNoEmptyInput(partnerEmail, msg.email, regular.email) && 
	checkImage(logoFile) &&
	checkImage(licenseFile) &&
	registeredForm.submit()
}
function checkNoEmptyInput($element, msg, regular){
	var value = $.trim($element.val());
	if(value !== ''){
		if(checkInput($element, msg, regular)){
			return true
		}else{
			return false
		}
	}
	return true
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
/* 企业信息编辑 */
var btnEdit = $('.btn-edit');
var flag = true;
btnEdit.on('click', function(){
	var formGroup = $(this).parents('.form-group');
	if(flag){
		formGroup.find('p').hide().siblings('input').show()
		$(this).html('取消')
	}else{
		formGroup.find('p').show().siblings('input').hide()
		$(this).html('<i class="fa fa-edit"></i>编辑')
	}
	flag = !flag;	
})