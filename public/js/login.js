$(function() {
  drawCode()
})
//保存表单Input对象
var mobileInput = $('#mobileUp'),
    mobileInput2 = $('#mobileIn'),
    passwdInput = $('#password'),
    passwdInput2 = $('#password2'),
    authCodeInput = $('#authcode'),
    phoneCodeInput = $('#phonecode'),
    btnSendCode = $('#btnSendCode'),
    agreeCheck = $('#agree'),
    btnSubmit = $('#btnSubmit');

//手机号码、密码正则表达式   
var pattern = {
    mobile: /^(13|14|15|17|18)[0-9]{9}$/,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/,
}
//错误信息提示
var message = {
    mobile: {
      required: '请输入手机号码',
      pattern: '手机号码格式不正确'
    },
    password: {
      required: '请输入密码',
      pattern: '必须包含大小写字母和数字的组合，不能使用特殊字符，长度在8-20之间'
    }
}
//发送验证码
btnSendCode.on('click', function() {
  formCheck(mobileInput, pattern.mobile, message.mobile) && sendCode()
})
//注册表单提交
btnSubmit.on('click',function(e) {
  e.preventDefault()
  submitFrom()
})
//登录表单提交
$('#btnSignIn').on('click',function(e){
  e.preventDefault()
  // formCheck(mobileInput, pattern.mobile, message.mobile) && 
  // formCheck(passwdInput, pattern.password, message.password) &&
  validateCode() && $('#signinForm').submit()
})
//注册表单验证
function submitFrom() {
  mobileValid && 
  formCheck(passwdInput, pattern.password, message.password) &&
  confirmPasswd() && validateCode() &&
  agreeProtocol() && $('#signupForm').submit()
}

//为输入框注册失去焦点事件
var mobileValid = false;
mobileInput.blur(function() {
  var valid = formCheck(mobileInput, pattern.mobile, message.mobile);
  if(valid){
    var mobile = $(this).val()
    var inputParent = $(this).parent();
    $.get('/findByMobile',{mobile: mobile}, function(res){
      if(res.status == 1){
        console.log(1)
        inputParent.removeClass('valid').addClass('error').next('.alert')
                    .html('<i class="fa fa-warning"></i>该手机号已注册，可直接登录').show();
        mobileInput.focus()
      }
      if(res.status == 2){
        mobileValid = true;
      }
    })
  }else{
    return false
  }
})
mobileInput2.blur(function(){
  formCheck(mobileInput, pattern.mobile, message.mobile);
})
passwdInput.blur(function() {
  if (formCheck(passwdInput, pattern.password, message.password)) {
    passwdInput2.attr('disabled', false)
  } else {
    passwdInput2.attr('disabled', true)
  }
  if (!passwdInput2.val() == '') {
    confirmPasswd()
  }
})
passwdInput2.blur(function() {
    if (passwdInput.val() !== '' && 　passwdInput2.val() !== '') {
      confirmPasswd()
    }
})
//表单正则验证方法
function formCheck(element, pattern, msg) {
  var value = $.trim($(element).val());
  var inputParent = $(element).parent();
  if (inputParent.next('.alert').length === 0) {
    inputParent.after('<p class="alert alert-warning"></p>')
  }
  if (value == '') {
    inputParent.removeClass('valid').addClass('error').next('.alert').html('<i class="fa fa-warning"></i>' + msg.required);
    $(element).focus();
    return false;
  } else if (!pattern.test(value)) {
    inputParent.removeClass('valid').addClass('error').next('.alert').html('<i class="fa fa-warning"></i>' + msg.pattern);
    $(element).focus();
    return false;
  } else {
    inputParent.removeClass('error').addClass('valid').next('.alert').hide();
    return true;
  }
}
//判断两次密码输入是否一致
function confirmPasswd() {
  var passwd = $.trim(passwdInput.val())
  var passwd2 = $.trim(passwdInput2.val())
  var inputParent = $('#password2').parent();
  if (inputParent.next('.alert').length === 0) {
    inputParent.after('<p class="alert alert-warning"></p>')
  }
  if (passwd == '' || passwd2 == '' || passwd !== passwd2) {
    inputParent.removeClass('valid').addClass('error').next('.alert').html('<i class="fa fa-warning"></i>' + '两次密码输入不一致');
    return false;
  } else {
    inputParent.removeClass('error').addClass('valid').next('.alert').remove();
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
function validateCode() {
  var inputCode = authCodeInput.val().toUpperCase();
  var inputParent = authCodeInput.parents('.form-group');
  code = code.toUpperCase()
  if (inputParent.next('.alert').length === 0) {
    inputParent.after('<p class="alert alert-warning"></p>')
  }
  if (inputCode == '') {
    inputParent.removeClass('valid').addClass('error').next('.alert').html('<i class="fa fa-warning"></i>请输入验证码');
    authCodeInput.focus();
    return false;
  } else if (inputCode !== code) {
    inputParent.removeClass('valid').addClass('error').next('.alert').html('<i class="fa fa-warning"></i>验证码错误');
    authCodeInput.val('').focus();
    drawCode();
    return false;
  } else {
    inputParent.removeClass('error').addClass('valid').next('.alert').remove();
    return true;
  }
}
//判断手机验证码格式
function validatePhoneCode() {
  var inputParent = phoneCodeInput.parents('.form-group');
  var phonecode = $.trim(phoneCodeInput.val());
  if (inputParent.next('.alert').length === 0) {
    inputParent.after('<p class="alert alert-warning"></p>')
  }
  if (phonecode == '') {
    inputParent.removeClass('valid').addClass('error').next('.alert').html('<i class="fa fa-warning"></i>请输入手机验证码');
    authCodeInput.focus();
    return false;
  } else if (phonecode.length < 4) {
    inputParent.removeClass('valid').addClass('error').next('.alert').html('<i class="fa fa-warning"></i>验证码格式有误');
    authCodeInput.focus();
    return false;
  } else {
    inputParent.removeClass('error').addClass('valid').next('.alert').remove()
    return true;
  }
}
//异步查询该手机号是否已注册
function queryMobile() {
  var number = mobileInput.val();
  // $.get('/findByMobile/',{number: number},function(){

  // })
  // .done(function(){

  // })
}
//发送验证码
function sendCode() {
  var count = 10;
  var timer;
  btnSendCode.attr('disabled', 'true')
  timer = setInterval(function() {
    if (count === 0) {
      clearInterval(timer);
      btnSendCode.removeAttr('disabled');
      btnSendCode.text('重新发送验证码')
    } else {
      count--;
      btnSendCode.text(count + '秒后重新获取')
    }
  }, 1000)
}
//是否同意注册协议
function agreeProtocol() {
  var inputParent = agreeCheck.parent();
  var checked = agreeCheck.prop('checked');
  if (inputParent.next('.alert').length === 0) {
    inputParent.after('<p class="alert alert-warning"></p>')
  }
  if (checked) {
    inputParent.removeClass('error').addClass('valid').next('.alert').remove();
    return true;
  } else {
    inputParent.removeClass('valid').addClass('error').next('.alert').html('<i class="fa fa-warning"></i>请同意注册协议并勾选');
    return false;
  }
}
//异步登录
$('#btnSignIn').on('click',function(e){
  e.preventDefault()
  var mobile = $.trim($('#mobileIn').val());
  var password = $.trim($('#passwordIn').val());
  if(mobile && password){
    $.ajax({
        url: '/user/signin',
        type: 'POST',
        dataType: 'json',
        data: {mobile: mobile, password: password},
      })
      .done(function(res) {
        console.log("success");
      })
      .fail(function() {
        console.log("error");
      })
    }
 
  
  // formCheck(mobileInput, pattern.mobile, message.mobile) && 
  // formCheck(passwdInput, pattern.password, message.password) &&
  validateCode() && $('#signinForm').submit()
})