//注册支付账号
//注册表单
const accountForm = $('#accountForm'),
			mobileInput = $('#mobile'),
			passwdInput = $('#password'),
			confirmPasswd = $('#confirmPasswd'),
			realName = $('#realName'),
			genderRadio = $('#genderRadio'),
			// idcard = $('#idcard'),
			// validity = $('#validity'),
			address = $('#start1'),
			agreeCheck = $('#agreePay'),
			accountSubmit = $('#accountSubmit');
//验证规则			
const regular = {
	mobile: /^(13|14|15|17|18)[0-9]{9}$/, 
	password: /^\d{6}$/,
	realname: /^[\u4e00-\u9fa5]{2,}$/,
	// idcard: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
	date: /^\d{4}-\d{1,2}-\d{1,2}/
}
//提示信息		
const msg = {
	mobile: {
		tip: '请输入11位手机号码，仅限中国大陆',
		required: '请输入手机号',
		regular: '手机号码格式不正确',
		existed: '该手机号已被绑定'
	},
	password: {
		tip: '支付密码为6位数字，不能使用连续或相同数字',
		required: '请输入密码',
		regular: '支付密码为6位数字',
		same: '密码不能是相同数字',
		continuity: '密码不能是连续数字',
	},
	confirmPasswd: {
		tip: '请再次输入密码',
		required: '请再次输入密码',
		inconsistent: '两次密码输入不一致'
	},
	realname: {
		tip: '请输入真实姓名',
		required: '请输入真实姓名',
		regular: '输入姓名不合法'
	},
	// idcard: {
	// 	tip: '请输入身份证号',
	// 	required: '请输入身份证号',
	// 	regular: '身份证号不合法'
	// },
	gender: {
		required: '请选择性别'
	},
	// date: {
	// 	required: '请选择日期',
	// 	regular: '日期格式有误'
	// },
	address: {
		required: '请选择地址'
	},
	agree: {
		check: '请同意支付协议并勾选'
	}
}
//表单提交事件	
accountSubmit.on('click', function(e){
	//e.preventDefault()
	checkInput(mobileInput, msg.mobile, regular.mobile) &&
	checkPayPassword(passwdInput, msg.password, regular.password) &&
	confirmPassword(confirmPasswd, passwdInput, msg.confirmPasswd) &&
	checkInput(realName, msg.realname, regular.realname) &&
	isRadioChecked(genderRadio, 'gender', msg.gender) &&
	// checkInput(idcard, msg.idcard, regular.idcard) &&
	// checkInput(validity, msg.date, regular.date) &&
	checkInput(address, msg.address) &&
	isCkecked(agreeCheck, msg.agree) && 
	// alert('表单提交')
	accountForm.submit()
})
//输入框实时验证
checkRealTime(mobileInput, msg.mobile, regular.mobile, checkInput)
checkRealTime(passwdInput, msg.password, regular.password, checkPayPassword)
checkRealTime(confirmPasswd, msg.confirmPasswd, regular.password, confirmPassword, passwdInput)
checkRealTime(realName, msg.realname, regular.realname, checkInput)
// checkRealTime(idcard, msg.idcard, regular.idcard, checkInput)
passwdInput.blur(function(){
	if($.trim(confirmPasswd.val()) !== ''){
		confirmPassword(confirmPasswd, passwdInput, msg.confirmPasswd)
	}
})
