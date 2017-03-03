(function(){
  /* 账户安全 */
  //修改密码表单
  const modifyPasswdForm = $('#modifyPasswdForm'),
        oldPasswd = $('#oldPasswd'),
        newPasswd = $('#newPasswd'),
        confirmPasswd = $('#confirmPasswd'),
        btnModifyPasswd = $('#btnModifyPasswd');

  //绑定手机号表单
  const mobileForm = $('#bindMobileForm'),
        mobileInput = $('#mobile'),
        phoneCode = $('#phoneCode'),
        btnSendCode = $('#btnSendCode'),
        btnBindMobile = $('#btnBindMobile');
  //修改手机号表单
  const modifyMobileForm = $('#modifyMobileForm'),
        newMobileInput = $('#newMobile'),
        phoneCode2 = $('#phoneCode2'),
        btnSendCode2 = $('#btnSendCode2'),
        btnModifyMobile = $('#btnModifyMobile');
  //修改邮箱号表单
  const modifyEmailForm = $('#modifyEmailForm'),
        newEmailInput = $('#newEmail'),
        btnModifyEmail = $('#btnModifyEmail');
  
  //正则表达式    
  const regular = {
      mobile: /^(13|14|15|17|18)[0-9]{9}$/, 
      email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      password: /^.{8,20}$/,
      name: /^.{3,20}$/,
      qq: /[1-9][0-9]{4,}/,
      idcard: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      date: /^\d{4}-\d{1,2}-\d{1,2}/
  }
  //信息提示
  const msg = {
    mobile: {
      required: '请输入手机号',
      regular: '手机号格式有误',
      existed: '该手机号已被绑定'
    },
    phoneCode: {
      required: '请输入手机验证码',
    },
    email: {
      required: '请输入邮箱号',
      regular: '邮箱格式不正确',
      existed: '该邮箱号已被绑定'
    },
    oldPasswd: {
      tip: '请输入原密码'
    },
    password: {
      tip: '密码长度为8-20位',
      required: '请输入密码',
      regular: '密码长度为8-20位',
    },
    confirmPasswd: {
      tip: '请再次输入密码',
      required: '请再次输入密码',
      inconsistent: '两次密码输入不一致'
    },
    name: {
      required: '昵称不能为空',
    },
    qq: {
      regular: 'QQ号格式有误',
    },
    idcard: {
      regular: '身份证号格式有误',
    },
    date: {
      regular: '日期格式有误'
    }
  }
  //修改密码表单验证
  focusEvent(oldPasswd, msg.oldPasswd, null, validateForm);
  focusEvent(newPasswd, msg.password, regular.password, validateForm);
  focusEvent(confirmPasswd, msg.confirmPasswd, regular.password, checkConsistency, newPasswd);
  //修改密码提交
  btnModifyPasswd.on('click', function(e){
    e.preventDefault()
    validateForm(oldPasswd, msg.password) &&
    validateForm(newPasswd, msg.password, regular.password) &&
    checkConsistency(confirmPasswd, newPasswd, msg.confirmPasswd) &&  
    modifyPasswdForm.submit()
  })
  //验证邮箱
  const verifyEmailBtn = $('#verifyEmailBtn');
  verifyEmailBtn.on('click', function(e){
    var email = $(this).attr('data-id');
    $.ajax({
      url: '/account/verify_email',
      type: 'post',
      data: {email: email},
    })
    .done(function(res) {
      if(res.status == 1){
        $.dialog().alert({message: '邮箱验证信息已发送至'+email+'邮箱,请注意查收'})
      }else if(res.status == 2){
        $.dialog().fail({message: '您的邮箱存在问题,请核实'})
      }else{
        $.dialog().alert({message: '系统错误，请重试'})
      }
    })
    .fail(function() {
      $.dialog().alert({message: '发送失败'})
    })
  })
  //绑定手机号验证
  mobileInput.blur(function(){
    if($.trim($(this).val()) == ''){
      removeTip($(this))
    }else{
      checkInput(mobileInput, msg.mobile, regular.mobile) &&
      queryAccount(mobileInput, 'findByMobile', msg.mobile, btnSendCode, 'null')
    }
  })
  //绑定手机号 获取验证码
  btnSendCode.on('click', function(e){
    e.preventDefault()
    if($(this).attr('data-status') == 0) return;
    checkInput(mobileInput, msg.mobile, regular.mobile);
    if($(this).attr('data-status') == 2) return;
    sendCode($(this), 20, mobileInput, mobileForm)
  })
  //绑定手机号提交
  btnBindMobile.on('click', function(e){
    e.preventDefault()
    checkInput(mobileInput, msg.mobile, regular.mobile) &&
    checkInput(phoneCode, msg.phoneCode) &&
    bindMobileForm.submit()
  })
  //修改手机号验证
  newMobileInput.blur(function(){
    if($.trim($(this).val()) == ''){
      removeTip($(this))
    }else{
      checkInput(newMobileInput, msg.mobile, regular.mobile) &&
      queryAccount(newMobileInput, 'findByMobile', msg.mobile, btnSendCode2, 'null')
    }
  })
  //修改手机号 获取验证码
  btnSendCode2.on('click', function(e){
    e.preventDefault()
    if($(this).attr('data-status') == 0) return;
    checkInput(newMobileInput, msg.mobile, regular.mobile);
    if($(this).attr('data-status') == 2) return;
    sendCode($(this), 20, newMobileInput, modifyMobileForm)
  })
 
  //修改手机号提交
  btnModifyMobile.on('click', function(e){
    e.preventDefault()
    if($(this).attr('data-status') == 0) return;
    checkInput(newMobileInput, msg.mobile, regular.mobile) &&
    checkInput(phoneCode2, msg.phoneCode) &&
    modifyMobileForm.submit()
  })

  //修改邮箱提交
  btnModifyEmail.on('click', function(e){
    e.preventDefault()
    if($(this).attr('data-status') == 0) return;
    checkInput(newEmailInput, msg.email, regular.email) &&
    modifyEmailForm.submit()
  })
  //发送验证码
  function sendCode($target, interval, $input, $form) {
    var count = interval || 30;
    var timer;
    var status = $target.attr('data-status');
    if(!status == '2') return;
    var number = $input.val();
    if($form.children('.code-info').length === 0){
      $form.prepend('<div class="alert alert-info code-info hidden"></div>');
    }
    var codeInfo = $form.children('.code-info');
    $.ajax({
      url: '/sendPhoneCode',
      data: {email: number},
    })
    .done(function(res) {
      codeInfo.html('信息！手机号 '+number+'的验证码是  '+res.code +', 10分钟内有效。').removeClass('hidden')
      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
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

  /* 账号编辑页 */
  //账户编辑表单对象
  const accountForm = $('#accountForm'),
        nameInput = $('#name'),
        qqInput = $('#qq'),
        idcard = $('#idcard'),
        birthday = $('#birthday'),
        address = $('#start1'),
        fileControl = $('.file-control'),
        previewArea =  $('.preview-area'),
        imgRemove = $('.img-remove'),
        accountSubmitBtn = $('#accountSubmitBtn');
  //点击选择本地图片
  previewArea.on('click', function(e){
     $(this).parents('.form-group').find('.file-control').click()
  })
  //图片预览
  fileControl.change(function(e){
    const picPreview = $(this).parents('.form-group').find('.pic-preview');
    checkImageRegular(this) 
    uploadPreview(this, picPreview)
    picPreview.parent().addClass('show');
  })
  //图片删除
  imgRemove.on('click', function(e){
    e.stopPropagation()
    clearFile($(this).parents('.form-group').find('.file-control'))
    $(this).prev().attr('src', '/img/upload.png').parents('.preview-area').removeClass('show');
    clearTip($(this))
  })
  //账户编辑表单提交
  function checkAccountForm(){
    return checkInput(nameInput, msg.name) &&
    checkInputValue(qqInput, msg.qq, regular.qq) &&
    checkInputValue(idcard, msg.idcard, regular.idcard) &&
    checkInputValue(birthday, msg.birthday, regular.birthday) &&
    checkImageRugular(avatarFile) &&
    checkImageRugular(idcardFrontFile) &&
    checkImageRugular(idcardBackFile)
  }
  accountSubmitBtn.on('click', function(e){
    e.preventDefault()
    checkAccountForm() && accountForm.submit()
  })
})(jQuery)