//用户删除
$('.btn-del').on('click', function(){
	var $tr = $(this).parents('tr');
	var name = $tr.children().eq(0).text();
	var uid = $tr.attr('data-id');
  $.dialog({type: 'confirm', message: '确定删除用户', 
    handlerConfirm: function(){ confirmDel() }, handlerCancel: function(){return false}})
  function confirmDel(){
    $.ajax({
      url: '/user/delete',
      data: {uid: uid},
      beforeSend: function(){
        var waiting = $.dialog({type: 'waiting',delay: 1000})
      }
    })
    .done(function(res) {
      waiting.destroy()
      console.log(res.status);
      if(res.status == 1){
        if($tr.length === 1){
          $.dialog({type: 'success', message: '删除成功',delay: 1000})
          $tr.remove()
        }
      }
    })
    .fail(function() {
      console.log("error");
    })
  }
})

//用户编辑
$('.btn-eidt').on('click', function(){
	var $tr = $(this).parents('tr');
	var uid = $tr.attr('data-id');
	var name = $tr.children().eq(0).text();
	var role = $tr.children().eq(3).text();
	var $modal = $('#myModal');
	var IdInput = $modal.find('#uid')
	var nameInput = $modal.find('.username');
	var roleInput = $modal.find('.role');
	IdInput.val(uid);
	nameInput.val(name);
	roleInput.val(role)
})
//修改密码
var oldPasswdInput = $('#oldPasswd'),
    newPasswdInput = $('#newPasswd'),
    confirmPasswdInput = $('#confirmPasswd'),
    updateForm = $('#updateForm'),
    btnSubmit = $('#btnSubmit');
function checkForm(element){
	var value = $.trim($(element).val());
	var fromGroup = $(element).parents('.form-group');
  if(value == '') {
  	fromGroup.addClass('error');
    $(element).focus();
    return false;
  }else{
  	fromGroup.removeClass('error');
    return true;
  }
}
function confrimPasswd(){
	var passwd = $.trim(newPasswdInput.val());
	var passwd2 = $.trim(confirmPasswdInput.val());
	if(passwd == '' || passwd2 == '' || passwd !== passwd2){
		confirmPasswdInput.parents('.from-group').addClass('error')
		return false
	}else{
		confirmPasswdInput.parents('.from-group').removeClass('error')
		return true
	}
}
btnSubmit.on('click', function(e){
	//e.preventDefault();
	checkForm(oldPasswdInput) && checkForm(newPasswdInput) && 
	confrimPasswd() && updateForm.submit()
})
   var oldpwd = $('#oldpwd'),
        passwdInput = $('#password1'),
        passwdInput2 = $('#password2'),
        btnConfirm = $('#btnConfirm');

  //密码正则表达式   
    var pattern = {
        password: /^\w{8,20}$/
    }
    //注册表单提交
    btnConfirm.on('click',function(e) {
      e.preventDefault()
      submitFrom()
    })
    //注册表单验证
    function submitFrom() {
      formCheck(oldpwd, pattern.password)&&
      formCheck(passwdInput, pattern.password) &&
      confirmPasswd() && $('#updataPasswdForm').submit()
    }
    //旧密码验证
    oldpwd.blur(function() {
      if(formCheck(oldpwd, pattern.password)){
        $(".tip1").hide();
      }else{
        $(".tip1").show();
      }
    })
    passwdInput.blur(function() {
      if (formCheck(passwdInput, pattern.password)) {
        passwdInput2.attr('disabled', false)
      } else {
        passwdInput2.attr('disabled', true)
      }
      if (!passwdInput2.val() == '') {
        confirmPasswd()
      }
    })
     function formCheck(element, pattern) {
      var value = $.trim($(element).val());
      if (value == '') {
        $(element).parent().next(".page-tip").show()
        $(element).focus();
        return false;
      } else if (!pattern.test(value)) {
         $(element).parent().next(".page-tip").show()
        $(element).focus();
        return false;
      } else {
         $(element).parent().next(".page-tip").hide();
        return true;
      }
    }
   passwdInput2.blur(function() {
        if (passwdInput.val() !== '' && passwdInput2.val() !== '') {
          confirmPasswd()
        }
    })   
    //判断两次密码输入是否一致
    function confirmPasswd() {
      var passwd = $.trim(passwdInput.val())
      var passwd2 = $.trim(passwdInput2.val())
      if (passwd == '' || passwd2 == '' || passwd !== passwd2) {
        $(".tip3").show();
        return false;
      } else {
        $(".tip3").hide();
        return true;
      }
    }