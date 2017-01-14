/* 公用方法 */

//表单输入框验证
var checkInput = function($element, msg, regular, wrapShow){
  if(!($element && msg)) throw new Error('至少两个参数！');
  var msgRequired = msg.required || '该项不能为空',
      msgregular = msg.regular || '输入格式有误';
  var wrapShow = wrapShow || false;
  var value = $.trim($element.val());
  var formGroup = $element.parents('.form-group');
  if(wrapShow){
  	if(formGroup.next('.alert').length === 0) {
	    formGroup.after('<div class="col-md-offset-3 alert alert-danger"></div>')
	  }
	  $alert = formGroup.next('.alert');
  }else {
	  if(formGroup.children('.alert').length === 0) {
	    formGroup.append('<div class="col-md-3 alert alert-danger"></div>')
	  }
	  $alert = formGroup.children('.alert');
  }
  if(value == '') {
    formGroup.removeClass('has-success').addClass('has-error');
    $alert.html('<i class="fa fa-warning"></i>'+msgRequired);
    $element.focus();
    return false;
  }else{
    if(regular){
      if(!regular.test(value)) {
        formGroup.removeClass('has-success').addClass('has-error');
        $alert.html('<i class="fa fa-warning"></i>'+msgregular);
        return false;
      }
    }
    formGroup.removeClass('has-error').addClass('has-success');
    $alert.remove();
    return true;
  }
}
//判断输入框两次输入是否一致
var confirmConsistent = function($element, $target, msg, wrapShow) {
  if(!($element && $target)) throw new Error('至少两个参数！');
  var msg = msg && msg.notMatch || '两次输入不一致';
  var wrapShow = wrapShow || false;
  var value = $.trim($element.val()),
      targetValue = $.trim($target.val());
  var formGroup = $element.parents('.form-group');
  if(wrapShow){
  	if (formGroup.next('.alert').length === 0) {
	    formGroup.after('<div class="col-md-offset-3 alert alert-danger"></div>');
	  }
	  $alert = formGroup.next('.alert');
  }else{
	  if (formGroup.children('.alert').length === 0) {
	    formGroup.append('<div class="col-md-3 alert alert-danger"></div>');
	  }
	  $alert = formGroup.children('.alert');
  }
  if (value == '' || targetValue == '' || value !== targetValue) {
    formGroup.removeClass('has-success').addClass('has-error');
    $alert.html('<i class="fa fa-warning"></i>'+msg );
    return false;
  } else {
    formGroup.removeClass('has-error').addClass('has-success');
    $alert.remove();
    return true;
  }
}
//异步查询号码
var _number;//保存号码，防止相同号码多次触发ajax事件
var queryAccount = function($element, router, msg, $target, wrapShow, contrary){
  if(!($element && router)) throw new Error('至少两个参数！');
  var msgExisted = msg && msg.existed || '该号码已存在';
  var msgNotExisted = msg && msg.notExisted || '该号码不存在';
  var wrapShow = wrapShow || false;
  var contrary = contrary || false;
  var number = $.trim($element.val());
  if(_number == number) return;
   _number = number;
  var formGroup = $element.parents('.form-group');
  if(!wrapShow){
  	if (formGroup.children('.alert').length === 0) {
	    formGroup.append('<p class="col-md-3 alert alert-danger hidden"></p>')
	  }
	  var $alert = formGroup.children('.alert');
	  $alert.addClass('hidden');
  }else {
  	if (formGroup.next('.alert').length === 0) {
	    formGroup.after('<div class="col-md-offset-3 col-md-9 alert alert-danger hidden"></div>')
	  }
	  var $alert = formGroup.next('.alert');
	  $alert.addClass('hidden');
  }
  $.ajax({
    url: '/'+router,
    data: {number: number}
  })
  .done(function(res){
    if(res.status == 1){
      if(contrary){
      	$alert && $alert.remove();
      	$target && $target.attr('data-status', 2);
      }else{
      	formGroup.removeClass('has-success').addClass('has-error');
      	$alert.removeClass('hidden').html('<i class="fa fa-warning"></i>'+ msgExisted);
      	$target && $target.attr('data-status', 0);
      }
    }
    if(res.status == 2){
    	if(contrary){
    		formGroup.removeClass('has-success').addClass('has-error');
      	$alert.removeClass('hidden').html('<i class="fa fa-warning"></i>'+ msgNotExisted);
      	$target && $target.attr('data-status', 0);
    	}else{
    		formGroup.removeClass('has-error').addClass('has-success');
      	$alert && $alert.remove();
      	$target && $target.attr('data-status', 2);
    	}
    }
  })
  .fail(function(err){
    console.log(err)
  })
}

//生成验证码
var code;  //保存验证码
var createCode = function(codeLength) {
  var codeLength = codeLength || 4;
  const ALPHABET = 'abcdefghijklmnopqrstuvwxyz1234567890';
  code = '';
  for (let i = 0; i < codeLength; i++) {
    code += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length))
  }
  return code;
}
//canvas绘制验证码
var drawCode = function() {
  var canvas = document.getElementById('canvasCode');
  var cxt = canvas.getContext('2d');
  cxt.clearRect(0, 0, 1000, 1000);
  cxt.font = "24px Microsoft Yahei";
  cxt.backgroundColor = '#ccc';
  cxt.fillStyle = '#444';
  cxt.fillText(createCode(), 8, 25)
}

//校验验证码
var checkCode = function($element, msg, wrapShow) {
	if(!($element && msg)) throw new Error('至少两个参数！');
	var msgRequired = msg.required || '不能为空！';
	var msgError = msg.error || '验证码错误！';
	var wrapShow = wrapShow || false;
  var inputCode = $.trim($element.val()).toUpperCase();
  var formGroup = $element.parents('.form-group');
  code = code.toUpperCase();
  if(!wrapShow){
  	if (formGroup.children('.alert').length === 0) {
	    formGroup.append('<div class="col-md-3 alert alert-danger"></div>')
	  }
	  var $alert = formGroup.children('.alert');
  }else{
  	if (formGroup.next('.alert').length === 0) {
	    formGroup.after('<div class="col-md-offset-3 alert alert-danger"></div>')
	  }
	  var $alert = formGroup.next('.alert');
  }
  if (inputCode == '') {
    formGroup.removeClass('has-success').addClass('has-error');
    $alert.html('<i class="fa fa-warning"></i>'+ msgRequired);
    $element.focus();
    return false;
  } else if (inputCode !== code) {
    formGroup.removeClass('has-success').addClass('has-error');
    $alert.html('<i class="fa fa-warning"></i>'+ msgError);
    $element.val('').focus();
    drawCode();
    return false;
  } else {
    formGroup.removeClass('has-error').addClass('has-success');
    $alert.remove();
    return true;
  }
}

//验证多选框是否勾选
var checkCheckbox = function($element, msg, wrapShow) {
	if(!($element && msg)) throw new Error('至少两个参数！');
	var msgRequired = msg.required || '需要勾选';
	var wrapShow = wrapShow || false;
  var formGroup = $element.parents('.form-group');
  var checked = $element.prop('checked');
  if(!checked) {
	  if(!wrapShow){
	  	if (formGroup.children('.alert').length === 0) {
		    formGroup.append('<div class="col-md-3 alert alert-danger"></div>')
		  }
		  var $alert = formGroup.children('.alert');
	  }else{
	  	if (formGroup.next('.alert').length === 0) {
		    formGroup.after('<div class="alert alert-danger"></div>')
		  }
		  var $alert = formGroup.next('.alert');
	  }
   	formGroup.removeClass('has-success').addClass('has-error');
    $alert.html('<i class="fa fa-warning"></i>'+ msgRequired);
    return false;
  } else {
    $alert && $alert.remove();
    return true;
  }
}

//上传图片预览
var uploadPreview = function(fileInput, $image){
  if(fileInput.files && fileInput.files[0]){
    var reader = new FileReader();
    reader.onload = function(e){
      $image.attr('src', e.target.result)
    }
    reader.readAsDataURL(fileInput.files[0])
  }
}

//上传图片验证
var checkImage = function(fileInput, msg, regular, sizeLimit){
	/*
		$fileInput  //file类型的input对象  
		msg         //错误信息提示
		regular     //图片格式正则表达式 默认 gif|jpg|jpeg|png
		sizeLimit   //图片尺寸大小限制   默认 1024K
	*/
	if(!(fileInput instanceof jQuery || fileInput.nodeType === 1)) 
	throw new Error(fileInput + '不是DOM对象！');
	var msgRequired = msg && msg.required || '请选择图片',
	    msgRegular = msg && msg.regular || '图片格式有误',
	 		msgSize = msg && msg.size || '图片大小超过限制',
	 		regular = regular || /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/,
	 		sizeLimit = sizeLimit || 1024;
	var formGroup = $(fileInput).parents('.form-group');
	if(formGroup.next('.alert').length === 0) {
    formGroup.after('<div class="alert alert-danger hidden"></div>')
  }
  var $alert = formGroup.next('.alert');
  var fileObj = fileInput instanceof jQuery ? fileInput[0] : fileInput;
	var fileValue = fileObj.value,
	    fileSize = fileObj.files[0] && fileObj.files[0].size / 1024;
	if(fileValue == ''){
		$alert.removeClass('hidden').html('<i class="fa fa-warning"></i>'+ msgRequired);
		return false;
	}else if(!regular.test(fileValue)){
		$alert.removeClass('hidden').html('<i class="fa fa-warning"></i>'+ msgRegular);
		return false;
	}else if(fileSize > sizeLimit){
		$alert.removeClass('hidden').html('<i class="fa fa-warning"></i>'+ msgSize);
		return false;
	}
	$alert && $alert.remove()
	return true;
}
//倒计时 自动跳转到指定页
var countDown = function($target, router, count){
  var count = count || 5;
  var timer;
  timer = setInterval(function() {
      if (count === 0) {
        clearInterval(timer);
        window.location.href = router;
      } else {
        count--;
        $target.text(count)
      }
    }, 1000)
}