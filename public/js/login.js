$(function() {
  //绘制验证码
  if($('#canvasCode').length !== 0) drawCode()
  //检测cookie是否保存用户登录信息
  if($.cookie('remember') == 'true'){
    $('#username').val(atob($.cookie('username')))
    $('#password').val(atob($.cookie('password')))
    $('#remember').prop('checked', true)
  }
})

//保存注册表单Input对象
const signupForm = $('#signupForm'),
      emailInput = $('#email'),
      passwdInput = $('#passwd'),
      passwdInput2 = $('#passwd2'),
      authCodeInput = $('#authcode'),
      agreeCheck = $('#agree'),
      btnSignup = $('#btnSignup');

//保存登录表单Input对象
const signinForm = $('#signinForm'),
      nameInput = $('#username'),
      passInput = $('#password'),
      authCodeInput2 = $('#authcode2'),
      rememberCheck = $('#remember'),
      btnSignIn = $('#btnSignIn');

// 忘记密码表单对象
const findPasswdForm = $('#findPasswdForm'),
      bindEmailInput = $('#bindEmail'),
      authcodeInput3 = $('#authcode3'),
      btnFindPasswd = $('#btnFindPasswd');

//重置密码表单对象      
const resetPasswdForm = $('#resetPasswdForm'),
      resetPasswordInput = $('#resetPassword'),
      resetPasswordInput2 = $('#resetPassword2'),
      btnResetPasswd = $('#btnResetPasswd');

//正则表达式   
const regular = {
      email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      password: /^.{8,20}$/,
}

//错误信息提示
const message = {
    email: {
      required: '请输入邮箱号',
      regular: '邮箱格式不正确',
      existed: '该邮箱号已注册，可直接登录',
      notExisted: '该邮箱号未绑定'
    },
    password: {
      required: '请输入密码',
      regular: '密码长度在8-20位之间',
      notMatch: '两次密码输入不一致'
    },
    authcode: {
      required: '验证码不能为空',
      error: '验证码错误'
    },
    agreeCheck: {
      required: '请同意注册协议并勾选'
    },
    username: {
      required: '请输入用户名'
    }
}

//注册按钮提交
btnSignup.on('click',function(e) {
  e.preventDefault()
  var status = $(this).attr('data-status');
  if(status == '0') return;
  signupSubmit()
})

//注册表单逐步验证
function signupSubmit() {
  checkInput(emailInput, message.email, regular.email, true) && 
  checkInput(passwdInput, message.password, regular.password, true) &&
  confirmConsistent(passwdInput2, passwdInput, message.password, true) && 
  checkCode(authCodeInput, message.authcode, true) && 
  checkCheckbox(agreeCheck, message.agreeCheck, true) && signupForm.submit()
}

//登录表单验证
function signinSubmit(){
  checkInput(nameInput, message.username, null, true) && 
  checkInput(passInput, message.password, null, true) && 
  checkCode(authCodeInput2, message.authcode, true) && 
  signinForm.submit()
}

//登录表单同步提交
btnSignIn.on('click', function(e){
  e.preventDefault()
  signinSubmit()
})
//找回密码表单提交
function findPasswdSubmit(){
  checkInput(bindEmailInput, message.email, regular.email, true) &&
  checkCode(authcodeInput3, message.authcode, true) &&
  findPasswdForm.submit()
}
btnFindPasswd.on('click', function(e){
  e.preventDefault();
  var status = $(this).attr('data-status');
  if(status == '0') return;
  findPasswdSubmit()
})
//重置密码表单提交
function resetPasswdSubmit(){
  checkInput(resetPasswordInput, message.password, regular.password, true) &&
  confirmConsistent(resetPasswordInput2, resetPasswordInput, message.password, true) && 
  resetPasswdForm.submit()
}
btnResetPasswd.on('click', function(e){
  e.preventDefault();
  resetPasswdSubmit()
})
//为输入框注册失去焦点事件
emailInput.blur(function() {
  checkInput(emailInput, message.email, regular.email, true, email) &&
  queryAccount(emailInput, 'findByEmail', message.email, btnSignup, true)
})
passwdInput.blur(function() {
  if (checkInput(passwdInput, message.password, regular.password, true)) {
    passwdInput2.attr('disabled', false)
  } else {
    passwdInput2.attr('disabled', true)
  }
  if (!passwdInput2.val() == '') {
    confirmConsistent(passwdInput2, passwdInput, message.password, true)
  }
})
passwdInput2.blur(function() {
  if (passwdInput.val() !== '' && passwdInput2.val() !== '') {
    confirmConsistent(passwdInput2, passwdInput, message.password, true)
  }
})
bindEmailInput.blur(function(){
  checkInput($(this), message.email, regular.email, true) &&
  queryAccount($(this), 'findByEmail', message.email, btnFindPasswd, true, true)
})
resetPasswordInput.blur(function(){
  checkInput(resetPasswordInput, message.password, regular.password, true)
})
resetPasswordInput2.blur(function(){
  if (resetPasswordInput.val() !== '' && resetPasswordInput2.val() !== '') {
    confirmConsistent(resetPasswordInput2, resetPasswordInput, message.password, true)
  }
})
//保存cookie 
function saveCookie(){
  var checked = rememberCheck.prop('checked');
  if(checked){
    var uname = btoa(nameInput.val());
    var passwd = btoa(passInput.val());
    $.cookie('remember', true, {expires: 7});
    $.cookie('username', uname, {expires: 7});
    $.cookie('password', passwd, {expires: 7});
  }else{
    $.cookie('remember', false, {expires: -1});
    $.cookie('username', '', {expires: -1});
    $.cookie('password', '', {expires: -1});
  }
}
//登录表单异步提交
/*btnSignIn.on('click',function(e){
  e.preventDefault();
  if(checkInput(nameInput, message.username) && checkInput(passInput, message.password) &&
    checkCode()){
    var name = $.trim(nameInput.val()),
        passwd = $.trim(passInput.val());
    var user = {
      name: name,
      passwd: passwd
    }
    if(signinForm.children('.fail').length === 0){
      signinForm.prepend('<p class="alert alert-warning fail" style="display:none"></p>');
    }
    var failPrompt = signinForm.children('.fail');
    var dialog = null;
    $.ajax({
        url: '/user/signinAsync',
        type: 'POST',
        data: {user: user},
        beforeSend: function(){
          dialog = $.dialog()
        }
      })
      .done(function(res) {
        dialog.destroy()
        if(res.status == 0){
          failPrompt.html('<i class="fa fa-warning"></i>用户名不存在!').show()
        }
        if(res.status == 1){
          failPrompt.html('<i class="fa fa-warning"></i>密码错误!').show()
        }
        if(res.status == 2){
          failPrompt.remove();
          saveCookie();
          $.dialog({
            message: '登录成功！',
            type: 'success',
            delay: 1000,
            maskOpcity: .6
          })
          setTimeout(function(){
            signinForm.submit();
          },1000)
        }
      })
      .fail(function() {
        console.log("has-error");
      })
  }else{
    return false;
  }
})*/