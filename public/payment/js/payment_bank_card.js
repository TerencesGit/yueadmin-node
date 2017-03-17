//注册表单
const bankForm = $('#bankForm'),
      realName = $('#realName'),
      // idCard = $('#idCard'),
      bankNum = $('#bankNum'),
      mobileInput = $('#mobile'),
      bankSubmit = $('#bankSubmit');
//验证规则      
const regular = {
  realname: /^[\u4e00-\u9fa5]{2,}$/,
  banknum: /^(\d{16}|\d{18}|\d{19}|\d{21})$/,
  // idcard: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  mobile: /^(13|14|15|17|18)[0-9]{9}$/  
}
//提示信息    
const msg = {
  realname: {
    tip: '请输入真实姓名',
    required: '请输入真实姓名',
    regular: '输入姓名不合法'
  },
  banknum: {
    tip: '请输入银行卡号',
    required: '银行卡号不能为空',
    regular: '银行卡号为19位数字'
  },
  // idcard: {
  //   tip: '请输入身份证号',
  //   required: '请输入身份证号',
  //   regular: '身份证号不合法'
  // },
   mobile: {
    tip: '请输入11位手机号码，仅限中国大陆',
    required: '请输入手机号',
    regular: '手机号码格式不正确',
    existed: '该手机号已被绑定'
  }
}
//表单提交事件  
bankSubmit.on('click',function(e){
  e.preventDefault()
  checkInput(realName, msg.realname, regular.realname) &&
  checkInput(bankNum, msg.banknum, regular.banknum) &&
  // checkInput(idCard, msg.idcard, regular.idcard) &&
  checkInput(mobileInput, msg.mobile, regular.mobile) &&
  // alert('表单提交')
  bankForm.submit()
})
//输入框实时验证
  checkRealTime(realName, msg.realname, regular.realname,checkInput)
  checkRealTime(bankNum, msg.banknum, regular.banknum,checkInput)
  // checkRealTime(idCard, msg.idcard, regular.idcard,checkInput)
  checkRealTime(mobileInput, msg.mobile, regular.mobile,checkInput)
