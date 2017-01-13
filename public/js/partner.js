/* 注册企业 */

//注册企业表单对象
const registeredForm = $('#registeredForm'),
			partnerName = $('#partnerName'),
			corporation = $('#corporation'),
			licenseId = $('#licenseId'),
			contactName = $('#contactName'),
			contactMobile = $('#contactMobile'),
			partnerEmail = $('#partnerEmail'),
			address = $('#address'),
			postcode = $('#postcode'),
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
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    password: /^.{8,20}$/,
    post: /[1-9]\d{5}(?!\d)/,
}
//错误信息提示			
const msg = {
	partnerName: {
		required: '企业名称必填'
	},
	corporation: {
		required: '法定代表人必填'
	},

}			
btnRegistered.on('click', function(e){
	e.preventDefault()
	registerSubmit()
})			
function registerSubmit(){
	checkInput(partnerName, msg.partnerName) &&
	checkInput(corporation, msg) &&
	checkInput(address, msg) &&
	checkInput(contactName, msg) &&
	checkInput(contactMobile, msg) &&
	checkEmail() && checkInput(postcode, msg) && 
	checkImage(logoFile) &&
	checkImage(licenseFile) &&
	alert(1234)
}
function checkEmail(){
	if($.trim(partnerEmail.val()) !== ''){
		if(checkInput(partnerEmail, msg, regular.email)){
			return true
		}else{
			return false
		}
	}else {

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