//商户代注册
//
const merchantDataTable = $('#merchantDataTable');
const accountDataTable = $('#accountDataTable');
merchantDataTable.length === 1 && merchantDataTable.dataTable();
accountDataTable.length === 1 && accountDataTable.dataTable();
//商户代注册表单
const merchantForm = $('#merchantForm'),
      merchantName = $('#merchantName'),
      merchantMobile = $('#merchantMobile'),
      merchantPasswd = $('#merchantPasswd'),
      confirmPasswd = $('#confirmPasswd'),
      merchantRegBtn = $('#merchantRegBtn');
//验证规则
const regular = {
	mobile: /^(13|14|15|17|18)[0-9]{9}$/,
	password: /^.{8,20}$/,
}
//提示信息
const msg = {
	name: {
		tip: '请输入商家名称',
		required: '请输入商家名称',
	},
	mobile: {
		tip: '账户名为商家手机号',
		required: '请输入账户名',
		regular: '手机号码格式错误',
	},
	password: {
    tip: '密码长度为8-20位',
    required: '请输入密码',
    regular: '密码长度为8-20位',
  },
  confirmPasswd: {
  	tip: '请再次输入密码',
  	inconsistent: '两次密码输入不一致',
  }
}
focusEvent(merchantName, msg.name, regular.name, validateForm);
focusEvent(merchantMobile, msg.mobile, regular.mobile, validateForm);
focusEvent(merchantPasswd, msg.password, regular.password, validateForm);
focusEvent(confirmPasswd, msg.confirmPasswd, regular.password, checkConsistency, merchantPasswd);
merchantRegBtn.on('click', function(e){
	e.preventDefault();
	checkRegForm() && merchantForm.submit()
})
//商户代注册表单校验
function checkRegForm(){
	return validateForm(merchantName, msg.name, regular.name) &&
  validateForm(merchantMobile, msg.mobile, regular.mobile) &&
  validateForm(merchantPasswd, msg.password, regular.password) &&
  checkConsistency(confirmPasswd, merchantPasswd, msg.confirmPasswd)
}
//状态管理
$('.btn-status').on('click', function(e){
	if($(this).hasClass('on')){
		$(this).removeClass('on').find('.fa').removeClass('fa-toggle-on').addClass('fa-toggle-off');
	}else{
		$(this).addClass('on').find('.fa').removeClass('fa-toggle-off').addClass('fa-toggle-on');
	}
})
 //点击选择本地图片
  $('.preview-area').on('click', function(e){
     $(this).parents('.form-group').find('.file-control').click()
  })
  //图片预览
  $('.file-control').change(function(e){
    const picPreview = $(this).parents('.form-group').find('.pic-preview');
    uploadPreview(this, picPreview)
    picPreview.parent().addClass('show');
  })