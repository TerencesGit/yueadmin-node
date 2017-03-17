// 设置身份信息
const agreeForm = $('#agreeForm'),
			bankCard = $('#bankCard'), 
 			bankPhone = $('#bankPhone'),
 			// checkCode = $('#checkCode'),
 			btnCard = $('#btnCard'),			
			agreeSubmit = $('#agreeSubmit');
//验证规则			
const regular = {
	banknum:  /^(\d{16}|\d{18}|\d{19}|\d{21})$/,
	mobile: /^(13|14|15|17|18)[0-9]{9}$/
	// code: /^\d{6}$/
}
//提示信息		
const msg = {				
	banknum: {
		tip: '请输入银行卡号',
		required: '银行卡号不能为空',
		regular: '银行卡号为19位数字'
	},
	mobile: {
		tip: '请输入11位手机号码，仅限中国大陆',
		required: '请输入手机号',
		regular: '手机号码格式不正确',
		existed: '该手机号已被绑定'
	 }
}

//表单提交事件	
agreeSubmit.on('click', function(e){
	e.preventDefault()
	checkInput(bankCard, msg.banknum, regular.banknum) &&
	checkInput(bankPhone, msg.mobile, regular.mobile) &&
	agreeForm.submit()
})
//输入框实时验证
checkRealTime(bankCard, msg.banknum, regular.banknum, checkInput)
checkRealTime(bankPhone, msg.mobile, regular.mobile, checkInput)

// 点击获取检验码
btnCard.on('click',function(e){
	$('.dis-block').removeClass('fn-hide')
	
})
