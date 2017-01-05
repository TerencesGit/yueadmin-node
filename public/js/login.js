$(function() {
  //绘制验证码
    drawCode();
  //检测cookie是否保存用户登录信息
  if($.cookie('remember') == 'true'){
    $('#username').val(atob($.cookie('username')))
    $('#password').val(atob($.cookie('password')))
    $('#remember').prop('checked', true)
  }
})

//保存注册表单Input对象
var emailInput = $('#email'),
    passwdInput = $('#passwd'),
    passwdInput2 = $('#passwd2'),
    authCodeInput = $('#authcode'),
    agreeCheck = $('#agree'),
    btnSignup = $('#btnSignup'),
    signupForm = $('#signupForm');

//保存登录表单Input对象
var nameInput = $('#username'),
    passInput = $('#password'),
    rememberCheck = $('#remember'),
    btnSignIn = $('#btnSignIn'),
    signinForm = $('#signinForm');

//邮箱、密码正则表达式   
var pattern = {
    //mobile: /^(13|14|15|17|18)[0-9]{9}$/,
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    password: /^.{8,20}$/,
}

//错误信息提示
var message = {
    email: {
      required: '请输入邮箱号',
      pattern: '邮箱格式不正确',
      existed: '该邮箱号已注册，可直接登录'
    },
    password: {
      required: '请输入密码',
      pattern: '密码长度在8-20位之间'
    },
    username: {
      required: '请输入用户名'
    }
}

//发送验证码
// btnSendCode.on('click', function(e) {
//   e.preventDefault()
//   var status = $(this).attr('data-status');
//   if(status == 0) return;
//   checkInput(emailInput, message.email, pattern.email) && sendCode()
// })
//注册按钮提交
btnSignup.on('click',function(e) {
  e.preventDefault()
  var status = $(this).attr('data-status');
  if(status == '0') return;
  signupSubmit()
})
//注册表单逐步验证
function signupSubmit() {
  checkInput(emailInput, message.email, pattern.email) && 
  checkInput(passwdInput, message.password, pattern.password) &&
  confirmPasswd() && checkCode() && agreeProtocol() && signupForm.submit()
}
//为输入框注册失去焦点事件
emailInput.blur(function() {
  checkInput(emailInput, message.email, pattern.email) &&
  queryEmail(emailInput, message.email)
})
passwdInput.blur(function() {
  if (checkInput(passwdInput, message.password, pattern.password)) {
    passwdInput2.attr('disabled', false)
  } else {
    passwdInput2.attr('disabled', true)
  }
  if (!passwdInput2.val() == '') {
    confirmPasswd()
  }
})
passwdInput2.blur(function() {
  if (passwdInput.val() !== '' && passwdInput2.val() !== '') {
    confirmPasswd()
  }
})
authCodeInput.blur(function(){
  var value = $.trim($(this).val());
  if(!value == ''){
    checkInput($(this), null)
  }
})
//表单验证方法
function checkInput(element, msg, pattern){
  var length = arguments.length;
  var value = $.trim($(element).val());
  var formGroup = $(element).parents('.form-group');
  var eleId = element.attr('id');
  if(formGroup.next('.alert').length === 0) {
    formGroup.after('<p class="alert alert-warning hidden"></p>')
  }
  if(value == '') {
    formGroup.removeClass('has-success').addClass('has-error').next('.alert').removeClass('hidden').html('<i class="fa fa-warning"></i>' + msg.required);
    $(element).focus();
    return false;
  }else{
    if(length === 3){
      if(!pattern.test(value)) {
        formGroup.removeClass('has-success').addClass('has-error').next('.alert').removeClass('hidden').html('<i class="fa fa-warning"></i>' + msg.pattern);
        $(element).focus();
        return false;
      }
    }
    if(eleId == 'email'){
      return true;
    }
    formGroup.removeClass('has-error').addClass('has-success').next('.alert').remove();
    return true;
  }
}
//异步查询邮箱号
var _number;//保存邮箱号，防止多次触发ajax事件
function queryEmail(element, msg){
  var number = $.trim($(element).val());
  if(_number == number) return;
   _number = number;
  var formGroup = $(element).parents('.form-group');
  $.ajax({
    url: '/findByEmail',
    data: {email: number}
  })
  .done(function(res){
      if(res.status == 1){
        formGroup.removeClass('has-success').addClass('has-error').next('.alert').removeClass('hidden')
                   .html('<i class="fa fa-warning"></i>' + msg.existed );
        btnSignup.attr('data-status', 0)
      }
      if(res.status == 2){
        formGroup.removeClass('has-error').addClass('has-success').next('.alert').remove();
        btnSignup.attr('data-status', 2)
      }
  })
  .fail(function(err){
    console.log(err)
  })
}
//判断两次密码输入是否一致
function confirmPasswd() {
  var passwd = $.trim(passwdInput.val())
  var passwd2 = $.trim(passwdInput2.val())
  var formGroup = passwdInput2.parents('.form-group');
  if (formGroup.next('.alert').length === 0) {
    formGroup.after('<p class="alert alert-warning"></p>')
  }
  if (passwd == '' || passwd2 == '' || passwd !== passwd2) {
    formGroup.removeClass('has-success').addClass('has-error').next('.alert').html('<i class="fa fa-warning"></i>' + '两次密码输入不一致');
    return false;
  } else {
    formGroup.removeClass('has-error').addClass('has-success').next('.alert').remove();
    return true;
  }
}
//绘制验证码
function drawCode() {
  var canvas = document.getElementById('canvas');
  var cxt = canvas.getContext('2d');
  cxt.clearRect(0, 0, 1000, 1000);
  cxt.font = "24px Microsoft Yahei";
  cxt.backgroundColor = '#ccc';
  cxt.fillStyle = '#444';
  cxt.fillText(createCode(), 10, 25)
}
//生成验证码
var code;
function createCode() {
  const codeLength = 4;
  const alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890';
  code = '';
  for (let i = 0, len = alphabet.length; i < codeLength; i++) {
    code += alphabet.charAt(Math.floor(Math.random() * len))
  }
  return code;
}
//校验验证码
function checkCode() {
  var inputCode = authCodeInput.val().toUpperCase();
  var formGroup = authCodeInput.parents('.form-group');
  code = code.toUpperCase()
  if (formGroup.next('.alert').length === 0) {
    formGroup.after('<p class="alert alert-warning"></p>')
  }
  if (inputCode == '') {
    formGroup.removeClass('has-success').addClass('has-error').next('.alert').html('<i class="fa fa-warning"></i>请输入验证码');
    authCodeInput.focus();
    return false;
  } else if (inputCode !== code) {
    formGroup.removeClass('has-success').addClass('has-error').next('.alert').html('<i class="fa fa-warning"></i>验证码错误');
    authCodeInput.val('').focus();
    drawCode();
    return false;
  } else {
    formGroup.removeClass('has-error').addClass('has-success').next('.alert').remove();
    return true;
  }
}
//判断手机验证码
function checkPhoneCode() {
  var formGroup = phoneCodeInput.parents('.form-group');
  var phonecode = $.trim(phoneCodeInput.val());
  if (formGroup.next('.alert').length === 0) {
    formGroup.after('<p class="alert alert-warning"></p>')
  }
  if (phonecode == '') {
    formGroup.removeClass('has-success').addClass('has-error').next('.alert').html('<i class="fa fa-warning"></i>请输入手机验证码');
    authCodeInput.focus();
    return false;
  } else if (phonecode.length < 4) {
    formGroup.removeClass('has-success').addClass('has-error').next('.alert').html('<i class="fa fa-warning"></i>验证码长度有误');
    authCodeInput.focus();
    return false;
  } else {
    formGroup.removeClass('has-error').addClass('has-success').next('.alert').remove()
    return true;
  }
}

//是否同意注册协议
function agreeProtocol() {
  var formGroup = agreeCheck.parents('.form-group');
  var checked = agreeCheck.prop('checked');
  if (formGroup.next('.alert').length === 0) {
    formGroup.after('<p class="alert alert-warning"></p>')
  }
  if (checked) {
    formGroup.removeClass('has-error').addClass('has-success').next('.alert').remove();
    return true;
  } else {
    formGroup.removeClass('has-success').addClass('has-error').next('.alert').html('<i class="fa fa-warning"></i>请同意注册协议并勾选');
    return false;
  }
}
//登录表单验证
function signinSubmit(){
  checkInput(nameInput, message.username) && 
  checkInput(passInput, message.password) && 
  checkCode() && signinForm.submit()
}

//登录表单同步提交
btnSignIn.on('click', function(e){
  e.preventDefault()
  signinSubmit()
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