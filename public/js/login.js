$(function() {
  //绘制验证码
  ($('#canvasCode').length === 1) && drawCode();
})
//注册表单对象
const signupForm = $('#signupForm'),
      emailInput = $('#email'),
      passwdInput = $('#passwd'),
      confirmPasswd = $('#confirmPasswd'),
      signupCode = $('#signupCode'),
      agreeCheck = $('#agree'),
      btnSignup = $('#btnSignup');

//登录表单对象
const signinForm = $('#signinForm'),
      nameInput = $('#username'),
      passInput = $('#password'),
      signinCode = $('#signinCode'),
      rememberCheck = $('#remember'),
      btnSignIn = $('#btnSignIn');

// 忘记密码表单对象
const findPasswdForm = $('#findPasswdForm'),
      bindEmailInput = $('#bindEmail'),
      findPasswdCode = $('#findPasswdCode'),
      btnFindPasswd = $('#btnFindPasswd');

//重置密码表单对象      
const resetPasswdForm = $('#resetPasswdForm'),
      resetPassword = $('#resetPassword'),
      resetPassword2 = $('#resetPassword2'),
      btnResetPasswd = $('#btnResetPasswd');

//正则表达式   
const regular = {
  email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  password: /^.{8,20}$/,
}

//信息提示
const msg = {
    email: {
      tip: '完成验证后，可用于邮箱登录和密码找回',
      required: '请输入邮箱号',
      regular: '邮箱格式不正确',
      existed: '该邮箱号已被占用',
    },
    bindEmail: {
      tip: '请输入绑定的邮箱号',
      required: '请输入邮箱号',
      regular: '邮箱格式不正确',
      notExisted: '该邮箱号未绑定'
    },
    password: {
      tip: '密码长度在8-20位之间',
      required: '请输入密码',
      regular: '密码长度在8-20位之间',
    },
    confirmPasswd: {
      tip: '请再次输入密码',
      required: '请再次输入密码',
      inconsistent: '两次密码输入不一致'
    },
    authcode: {
      tip: '看不清？点击图片更换验证码',
      required: '请输入验证码',
      error: '验证码错误'
    },
    agreeCheck: {
      required: '请同意注册协议并勾选'
    },
    username: {
      required: '请输入用户名'
    }
}
//注册表单失去焦点验证
focusEvent(passwdInput, msg.password, regular.password, validateForm);
focusEvent(confirmPasswd, msg.confirmPasswd, null, checkConsistency, passwdInput);
focusEvent(signupCode, msg.authcode, null, clearTip);
emailInput.focus(function(){
  if($.trim($(this).val()) == ''){
    onFocus($(this), msg.email)
  }
})
let _tempEmail;
emailInput.blur(function(){
  const value = $.trim($(this).val());

  if(value == ''){
    clearTip($(this))
    return;
  }
  if(_tempEmail == value) return;
  _tempEmail = value;
  validateForm(emailInput, msg.email, regular.email) &&
  queryEmail(emailInput, msg.email, btnSignup, 'null')
})
if(emailInput.length === 1){
  emailInput[0].oninput = function(){
    onFocus($(this), msg.email)
  }
}

//注册表单验证
function validateSignupForm(){
  return validateForm(emailInput, msg.email, regular.email) && 
  validateForm(passwdInput, msg.password, regular.password) &&
  checkConsistency(confirmPasswd, passwdInput, msg.confirmPasswd) && 
  validateCode(signupCode, msg.authcode) &&
  isCkecked(agreeCheck, msg.agreeCheck)
}
//注册按钮提交
btnSignup.on('click',function(e) {
  e.preventDefault()
  if($(this).attr('data-status') == 0) return;
  validateSignupForm() && signupForm.submit()
})
//登录表单验证
function validateSigninForm(){
  return validateForm(nameInput, msg.username, null, true) && 
  validateForm(passInput, msg.password, null, true) && 
  validateCode(signinCode, msg.authcode, true)
}
nameInput.blur(function(){
  if($(this).val() !== ''){
    clearTip($(this))
  }
})
passInput.blur(function(){
  if($(this).val() !== ''){
    clearTip($(this))
  }
})
signinCode.blur(function(){
  if($(this).val() !== ''){
    clearTip($(this))
  }
})
//登录表单提交
btnSignIn.on('click', function(e){
  e.preventDefault()
  validateSigninForm() && signinForm.submit()
})

//找回密码表单验证
let _tempBindEmail;
bindEmailInput.blur(function(){
  const value = $.trim($(this).val());
  if(value == ''){
    clearTip($(this));
    return;
  };
  if(_tempBindEmail == value) return;
  _tempBindEmail = value;
  validateForm($(this), msg.bindEmail, regular.email) &&
  queryEmail($(this), msg.bindEmail, btnFindPasswd, 'has')
})
if(findPasswdCode.length === 1){
  findPasswdCode[0].oninput = function(){
    clearTip($(this))
  }
}
//找回密码表单提交
btnFindPasswd.on('click', function(e){
  e.preventDefault();
  if($(this).attr('data-status') == 0) return;
  validateForm(bindEmailInput, msg.bindEmail, regular.email, true) &&
  validateCode(findPasswdCode, msg.authcode, true) &&
  findPasswdForm.submit()
})

//重置密码表单验证
focusEvent(resetPassword, msg.password, regular.password, validateForm)
focusEvent(resetPassword2, msg.confirmPasswd, regular.password, checkConsistency, resetPassword)
//重置密码表单提交
btnResetPasswd.on('click', function(e){
  e.preventDefault();
  validateForm(resetPassword, msg.password, regular.password) &&
  checkConsistency(resetPassword2, resetPassword, msg.confirmPasswd) && 
  resetPasswdForm.submit()
})