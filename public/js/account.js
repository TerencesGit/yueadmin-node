(function(){
  $(function(){
    //动态显示修改页
    var $tabList = $('.tab-list'),
        $tabItem = $tabList.children('li'),
        $tabCont = $('.tab-content');
    var index = $('.tab-list').find('.curr').index();
    $tabCont.eq(index).show().siblings().hide();
  })
  //账号绑定tab切换
  $tabItem.on('click', function(){
    $(this).addClass("curr").siblings().removeClass("curr");
    $tabCont.eq($(this).index()).show().siblings().hide();
  })
  //绑定手机号表单
  var mobileForm = $('#bindMobileForm'),
      mobileInput = $('#mobile'),
      phoneCodeInput = $('#phoneCode'),
      btnSendCode = $('#btnSendCode'),
      btnBindMobile = $('#btnBindMobile');
  //修改手机号表单
  var modifyMobileForm = $('#modifyMobileForm'),
      newMobileInput = $('#newMobile'),
      phoneCodeInput2 = $('#phoneCode2'),
      btnSendCode2 = $('#btnSendCode'),
      btnModifyMobile = $('#btnModifyMobile');
  //修改邮箱号表单
  var modifyEmailForm = $('#modifyEmailForm'),
      newEmailInput = $('#newEmail'),
      btnModifyEmail = $('#btnModifyEmail');
  //修改密码表单
  var modifyPasswdForm = $('#modifyEmailForm'),
      oldPasswd = $('#oldPasswd'),
      newPasswd = $('#newPasswd'),
      confirmPasswd = $('#confirmPasswd'),
      btnModifyPasswd = $('#btnModifyPasswd');
  //正则表达式    
  var pattern = {
    mobile: /^(13|14|15|17|18)[0-9]{9}$/, 
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    password: /^.{8,20}$/,
  }
  //错误信息提示
  var msg = {
    mobile: {
      required: '请输入手机号',
      pattern: '请输入正确手机号',
      existed: '该手机号已被绑定'
    },
    phoneCode: {
      required: '请输入手机验证码',
    },
    email: {
      required: '请输入邮箱号',
      pattern: '邮箱格式不正确'
    },
    password: {
      required: '请输入密码',
      pattern: '密码长度在8-20位之间',
    }
  }
  //输入框失去焦点事件
  mobileInput.blur(function(event){
    checkInput(mobileInput, msg.mobile, pattern.mobile) &&
    queryAccount(mobileInput, 'findByEmail', msg.existed, btnSendCode)
  })
  oldPasswd.blur(function(event){
    checkInput(oldPasswd, msg.password)
  })
  newPasswd.blur(function(event) {
    checkInput(newPasswd, msg.password, pattern.password) && confirmPasswd.attr('disabled', false)
    var value = $.trim(confirmPasswd.val());
    if(value == '') return;
    confirmConsistent(confirmPasswd, $(this))
  });
  confirmPasswd.blur(function(){
    var value = $.trim($(this).val());
    if(value == '') return;
    confirmConsistent($(this), newPasswd)
  })
  //获取验证码
  btnSendCode.on('click', function(e){
    e.preventDefault()
    var status = $(this).attr('data-status');
    if(status == 0) return;
    sendCode($(this), 20)
  })
  //绑定手机号提交
  btnBindMobile.on('click', function(e){
    e.preventDefault()
    checkInput(mobileInput, msg.mobile, pattern.mobile) &&
    checkInput(phoneCodeInput, msg.phoneCode)
  })
  //修改手机号提交
  btnModifyMobile.on('click', function(e){
    e.preventDefault()
    checkInput(newMobileInput, msg.mobile, pattern.mobile) &&
    checkInput(phoneCodeInput, msg.phoneCode)
  })
  //修改邮箱提交
  btnModifyEmail.on('click', function(e){
    e.preventDefault()
    checkInput(newEmailInput, msg.email, pattern.email) 
  })
  //修改密码提交
  btnModifyPasswd.on('click', function(e){
    e.preventDefault()
    checkInput(oldPasswd, msg.password) &&
    checkInput(newPasswd, msg.password, pattern.password) &&
    confirmConsistent(confirmPasswd, newPasswd) 
  })
  //发送验证码
  function sendCode(target, interval) {
    var $target = target || {};
    var count = interval || 30;
    var timer;
    var status = $target.attr('data-status');
    if(!status == 2) return;
    // var number = emailInput.val();
    // if(signupForm.children('.fail').length === 0){
    //   signupForm.prepend('<p class="alert alert-success fail" style="display:none"></p>');
    // }
    // var failPrompt = signupForm.children('.fail');
    // $.ajax({
    //   url: '/sendPhoneCode',
    //   data: {email: number},
    // })
    // .done(function(res) {
    //   failPrompt.html('手机号码'+number+'的验证码是'+'  '+res.code).show()
    //   console.log("success");
    // })
    // .fail(function() {
    //   console.log("has-error");
    // })
    $target.attr('disabled', 'true')
    timer = setInterval(function() {
      if (count === 0) {
        clearInterval(timer);
        $target.removeAttr('disabled');
        $target.text('重新发送验证码')
      } else {
        count--;
        $target.text(count + '秒后重新获取')
      }
    }, 1000)
  }
})(jQuery)