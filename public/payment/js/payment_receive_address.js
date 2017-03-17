const adressForm = $('#adressForm'),
      realName = $('#realName'),
      address = $('#start1'),
      detailAdress = $('#detailAdress'),
      postCode = $('#postCode'),
      mobileInput = $('#mobile'),
      addressSubmit = $('#addressSubmit');
//验证规则      
const regular = { 
  mobile: /^(13|14|15|17|18)[0-9]{9}$/, 
  postcode: /^\d{6}$/,
  realname: /^[\u4e00-\u9fa5]{2,}$/
}
//提示信息    
const msg = {
  mobile: {
    tip: '请输入11位手机号码，仅限中国大陆',
    required: '请输入手机号',
    regular: '手机号码格式不正确',
    existed: '该手机号已被绑定'
  },
  detailadress: {
    tip: '请输入详细地址',
    required: '请输入详细地址'
  },
  postcode: {
    tip: '请输入6位数字的邮政编码',
    required: '请输入邮政编码',
    inconsistent: '输入的邮政编码格式不正确'
  },
  realname: {
    tip: '请输入真实姓名',
    required: '请输入真实姓名',
    regular: '输入姓名不合法'
  },
  address: {
    tip: '请选择地址',
    required: '请选择地址'
  }
}
//表单提交事件  
addressSubmit.on('click', function(e){
  e.preventDefault()
  checkInput(realName, msg.realname, regular.realname) &&
  checkInput(address, msg.address) &&
  checkInput(detailAdress, msg.detailadress) &&
  checkInput(postCode, msg.postcode, regular.postcode) &&
  checkInput(mobileInput, msg.mobile, regular.mobile) &&
  alert('表单提交')
  //adressForm.submit()
})
//输入框实时验证
checkRealTime(realName, msg.realname, regular.realname, checkInput)
checkRealTime(address, msg.address, checkInput)
checkRealTime(detailAdress, msg.detailadress, checkInput)
checkRealTime(postCode, msg.postcode, regular.postcode, checkInput)
checkRealTime(mobileInput, msg.mobile, regular.mobile, checkInput)   