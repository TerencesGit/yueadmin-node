(function(){
  /* 账号绑定页 */
  const $tabList = $('.tab-list'),
        $tabItem = $tabList.children('li'),
        $tabCont = $('.tab-content');
  $(function(){
    //动态显示修改页
    const index = $('.tab-list').find('.curr').index();
    $tabCont.eq(index).show().siblings().hide();
  })
  //账号绑定tab切换
  $tabItem.on('click', function(){
    $(this).addClass("curr").siblings().removeClass("curr");
    $tabCont.eq($(this).index()).show().siblings().hide();
  })
  //绑定手机号表单
  const mobileForm = $('#bindMobileForm'),
        mobileInput = $('#mobile'),
        phoneCodeInput = $('#phoneCode'),
        btnSendCode = $('#btnSendCode'),
        btnBindMobile = $('#btnBindMobile');
  //修改手机号表单
  const modifyMobileForm = $('#modifyMobileForm'),
        newMobileInput = $('#newMobile'),
        phoneCodeInput2 = $('#phoneCode2'),
        btnSendCode2 = $('#btnSendCode2'),
        btnModifyMobile = $('#btnModifyMobile');
  //修改邮箱号表单
  const modifyEmailForm = $('#modifyEmailForm'),
        newEmailInput = $('#newEmail'),
        btnModifyEmail = $('#btnModifyEmail');
  //修改密码表单
  const modifyPasswdForm = $('#modifyPasswdForm'),
        oldPasswd = $('#oldPasswd'),
        newPasswd = $('#newPasswd'),
        confirmPasswd = $('#confirmPasswd'),
        btnModifyPasswd = $('#btnModifyPasswd');
  //正则表达式    
  const regular = {
      mobile: /^(13|14|15|17|18)[0-9]{9}$/, 
      email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      password: /^.{8,20}$/,
      name: /^.{3,20}$/,
      qq: /[1-9][0-9]{4,}/,
      idcard: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  }
  //信息提示
  const msg = {
    mobile: {
      required: '请输入手机号',
      regular: '请输入正确手机号',
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
    password: {
      required: '请输入密码',
      regular: '密码长度在8-20位之间',
    },
    name: {
      required: '昵称不能为空',
    },
    qq: 'qq格式有误',
    idcard: '身份证号格式有误',
  }
  //输入框失去焦点事件
  mobileInput.blur(function(event){
    checkInput(mobileInput, msg.mobile, regular.mobile) &&
    queryAccount(mobileInput, 'findByMobile', msg.mobile, btnSendCode)
  })
  newMobileInput.blur(function(event){
    checkInput(newMobileInput, msg.mobile, regular.mobile) &&
    queryAccount(newMobileInput, 'findByMobile', msg.mobile, btnSendCode2)
  })
  newEmailInput.blur(function(event){
    checkInput(newEmailInput, msg.email, regular.email) &&
    queryAccount(newEmailInput, 'findByEmail', msg.email, btnModifyEmail)
  })
  oldPasswd.blur(function(event){
    checkInput(oldPasswd, msg.password)
  })
  newPasswd.blur(function(event) {
    checkInput(newPasswd, msg.password, regular.password) && 
    confirmPasswd.attr('disabled', false);
    var value = $.trim(confirmPasswd.val());
    if(value == '') return;
    confirmConsistent(confirmPasswd, $(this));
  });
  confirmPasswd.blur(function(){
    var value = $.trim($(this).val());
    if(value == '') return;
    confirmConsistent($(this), newPasswd)
  })
  //验证邮箱
  var verifyEmailBtn = $('#verifyEmailBtn');
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
  //绑定手机号 获取验证码
  btnSendCode.on('click', function(e){
    e.preventDefault()
    checkInput(mobileInput, msg.mobile, regular.mobile);
    var status = $(this).attr('data-status');
    if(status == 0) return;
    sendCode($(this), 20, mobileInput, mobileForm)
  })
  //修改手机号 获取验证码
  btnSendCode2.on('click', function(e){
    e.preventDefault()
    checkInput(newMobileInput, msg.mobile, regular.mobile);
    var status = $(this).attr('data-status');
    if(status == 0) return;
    sendCode($(this), 20, newMobileInput, modifyMobileForm)
  })
  //绑定手机号提交
  btnBindMobile.on('click', function(e){
    e.preventDefault()
    checkInput(mobileInput, msg.mobile, regular.mobile) &&
    checkInput(phoneCodeInput, msg.phoneCode) &&
    bindMobileForm.submit()
  })
  //修改手机号提交
  btnModifyMobile.on('click', function(e){
    e.preventDefault()
    let status = $(this).attr('data-status');
    if(status == 0) return;
    checkInput(newMobileInput, msg.mobile, regular.mobile) &&
    checkInput(phoneCodeInput2, msg.phoneCode) &&
    modifyMobileForm.submit()
  })
  //修改邮箱提交
  btnModifyEmail.on('click', function(e){
    e.preventDefault()
    let status = $(this).attr('data-status');
    if(status == 0) return;
    checkInput(newEmailInput, msg.email, regular.email) &&
    modifyEmailForm.submit()
  })
  //修改密码提交
  btnModifyPasswd.on('click', function(e){
    e.preventDefault()
    checkInput(oldPasswd, msg.password) &&
    checkInput(newPasswd, msg.password, regular.password) &&
    confirmConsistent(confirmPasswd, newPasswd) &&  
    modifyPasswdForm.submit()
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
        idcardInput = $('#idcard'),
        addressInput = $('#address'),
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
    checkImage(this) && uploadPreview(this, picPreview)
    picPreview.parent().addClass('show');
  })
  //图片删除
  imgRemove.on('click', function(e){
    e.stopPropagation()
    const fileControl = $(this).parents('.form-group').find('.file-control');
    clearFile(fileControl)
    $(this).prev().attr('src', '').parents('.preview-area').removeClass('show');
  })
  //账户编辑表单提交
  accountSubmitBtn.on('click', function(e){
    e.preventDefault()
    checkInput(nameInput, msg.name) &&
    checkInputValue(qqInput, msg.qq, regular.qq) &&
    checkInputValue(idcardInput, msg.idcard, regular.idcard) &&
    checkImageRugular(avatarFile) &&
    checkImageRugular(idcardFrontFile) &&
    checkImageRugular(idcardBackFile) &&
    accountForm.submit()
  })
})(jQuery)