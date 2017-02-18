/* 公用方法 */

//表单输入框验证
const checkInput = function($element, msg, regular, wrapShow){
  const msgRequired = msg && msg.required || '该项为必填',
        msgRegular = msg && msg.regular || '输入格式有误';
  wrapShow = wrapShow || false;
  const value = $.trim($element.val());
  const formGroup = $element.parents('.form-group');
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
    $alert.html('<i class="fa fa-minus-circle"></i>'+msgRequired);
    $element.focus();
    return false;
  }else{
    if(regular){
      if(!regular.test(value)) {
        formGroup.removeClass('has-success').addClass('has-error');
        $alert.html('<i class="fa fa-minus-circle"></i>'+msgRegular);
        $element.focus();
        return false;
      }
    }
    formGroup.removeClass('has-error').addClass('has-success');
    $alert.remove();
    return true;
  }
}

//输入框有值时验证
const checkInputValue = function($element, msg, regular, wrapShow){
  if($.trim($element.val()) == '') {
    const formGroup = $element.parents('.form-group');
    if(formGroup.children('.alert').length !== 0){
      formGroup.children('.alert').remove();
    }
    formGroup.removeClass('has-error');
    return true;
  }
  return checkInput($element, msg, regular, wrapShow);
}

//输入框简单验证
const simpleCheckInput = function($element){
  const value = $.trim($element.val());
  const formGroup = $element.parents('.form-group');
  if(value == ''){
    formGroup.removeClass('has-success').addClass('has-error');
    return false;
  }else{
    formGroup.removeClass('has-error').addClass('has-success');
    return true;
  }
}
//输入框为空验证
const isEmptyInput = function($element){
  const value = $.trim($element.val());
  return value.length;
}
//判断输入框两次输入是否一致
const confirmConsistent = function($element, $target, msg, wrapShow) {
  if(!($element && $target)) throw new Error('至少两个参数！');
  const msg = msg && msg.notMatch || '两次输入不一致';
  const wrapShow = wrapShow || false;
  const value = $.trim($element.val()),
      targetValue = $.trim($target.val());
  const formGroup = $element.parents('.form-group');
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
    $alert.html('<i class="fa fa-minus-circle"></i>'+msg );
    return false;
  } else {
    formGroup.removeClass('has-error').addClass('has-success');
    $alert.remove();
    return true;
  }
}
//异步查询号码
var _number;//保存号码，防止相同号码多次触发ajax事件
const queryAccount = function($element, router, msg, $target, wrapShow, contrary){
  if(!($element && router)) throw new Error('至少两个参数！');
  const msgExisted = msg && msg.existed || '该号码已存在';
  const msgNotExisted = msg && msg.notExisted || '该号码不存在';
  const wrapShow = wrapShow || false;
  const contrary = contrary || false;
  const number = $.trim($element.val());
  if(_number == number) return;
   _number = number;
  const formGroup = $element.parents('.form-group');
  if(!wrapShow){
  	if (formGroup.children('.alert').length === 0) {
	    formGroup.append('<p class="col-md-3 alert alert-danger hidden"></p>')
	  }
	  const $alert = formGroup.children('.alert');
	  $alert.addClass('hidden');
  }else {
  	if (formGroup.next('.alert').length === 0) {
	    formGroup.after('<div class="col-md-offset-3 col-md-9 alert alert-danger hidden"></div>')
	  }
	  const $alert = formGroup.next('.alert');
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
      	$alert.removeClass('hidden').html('<i class="fa fa-minus-circle"></i>'+ msgExisted);
      	$target && $target.attr('data-status', 0);
      }
    }
    if(res.status == 2){
    	if(contrary){
    		formGroup.removeClass('has-success').addClass('has-error');
      	$alert.removeClass('hidden').html('<i class="fa fa-minus-circle"></i>'+ msgNotExisted);
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
const createCode = function(codeLength) {
  const codeLength = codeLength || 4;
  const ALPHABET = 'abcdefghijklmnopqrstuvwxyz1234567890';
  code = '';
  for (let i = 0; i < codeLength; i++) {
    code += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length))
  }
  return code;
}
//canvas绘制验证码
const drawCode = function() {
  const canvas = document.getElementById('canvasCode');
  const cxt = canvas.getContext('2d');
  cxt.clearRect(0, 0, 1000, 1000);
  cxt.font = "24px Microsoft Yahei";
  cxt.backgroundColor = '#ccc';
  cxt.fillStyle = '#444';
  cxt.fillText(createCode(), 8, 25)
}

//校验验证码
const checkCode = function($element, msg, wrapShow) {
	if(!($element && msg)) throw new Error('至少两个参数！');
	const msgRequired = msg.required || '不能为空！';
	const msgError = msg.error || '验证码错误！';
	const wrapShow = wrapShow || false;
  const inputCode = $.trim($element.val()).toUpperCase();
  const formGroup = $element.parents('.form-group');
  code = code.toUpperCase();
  if(!wrapShow){
  	if (formGroup.children('.alert').length === 0) {
	    formGroup.append('<div class="col-md-3 alert alert-danger"></div>')
	  }
	  const $alert = formGroup.children('.alert');
  }else{
  	if (formGroup.next('.alert').length === 0) {
	    formGroup.after('<div class="col-md-offset-3 alert alert-danger"></div>')
	  }
	  const $alert = formGroup.next('.alert');
  }
  if (inputCode == '') {
    formGroup.removeClass('has-success').addClass('has-error');
    $alert.html('<i class="fa fa-minus-circle"></i>'+ msgRequired);
    $element.focus();
    return false;
  } else if (inputCode !== code) {
    formGroup.removeClass('has-success').addClass('has-error');
    $alert.html('<i class="fa fa-minus-circle"></i>'+ msgError);
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
const checkCheckbox = function($element, msg, wrapShow) {
	if(!($element && msg)) throw new Error('至少两个参数！');
	const msgRequired = msg.required || '需要勾选';
	const wrapShow = wrapShow || false;
  const formGroup = $element.parents('.form-group');
  const checked = $element.prop('checked');
  if(!checked) {
	  if(!wrapShow){
	  	if (formGroup.children('.alert').length === 0) {
		    formGroup.append('<div class="col-md-3 alert alert-danger"></div>')
		  }
		  const $alert = formGroup.children('.alert');
	  }else{
	  	if (formGroup.next('.alert').length === 0) {
		    formGroup.after('<div class="alert alert-danger"></div>')
		  }
		  const $alert = formGroup.next('.alert');
	  }
   	formGroup.removeClass('has-success').addClass('has-error');
    $alert.html('<i class="fa fa-minus-circle"></i>'+ msgRequired);
    return false;
  } else {
    $alert && $alert.remove();
    return true;
  }
}

//判断是否上传文件
const hasFile = function(fileControl){
  fileControl = fileControl instanceof jQuery ? fileControl[0] : fileControl;
  return fileControl.files && fileControl.files[0];
}

//检测上传文件类型
const checkFileType = function(fileControl){
  if(!hasFile(fileControl)) return true;
  const fileObj = fileControl instanceof jQuery ? fileControl[0] : fileControl;
  const fileValue = fileObj.value;
  const imgRegular = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/,
        docRegular = /\.(doc|docx|pdf)$/;
  if(imgRegular.test(fileValue)){
    return 'image';
  }else if(docRegular.test(fileValue)){
    return 'document';
  }else{
    return false;
  }
}
//获取上传文件名称
const getFileName = function(fileControl){
  if(!hasFile(fileControl)) return;
  const fileObj = fileControl instanceof jQuery ? fileControl[0] : fileControl;
  return fileObj.files[0].name;
}

//文件必选验证
const checkFileRequired = function(fileControl, msg){
  if(hasFile(fileControl)) return true;
  const msgRequired = msg && msg.required || '请选择文件';
  const formGroup = fileControl.parent();
  if(formGroup.children('.alert').length === 0) {
    formGroup.append('<div class="alert alert-danger hidden"></div>')
  }
  const $alert = formGroup.children('.alert');
  $alert.removeClass('hidden').html('<i class="fa fa-minus-circle"></i>'+ msgRequired);
  return false;
}

//上传文档格式验证
const checkDocument = function(fileControl){
  const msg = '不支持该文件类型';
  const formGroup = $(fileControl).parent();
  if(formGroup.children('.alert').length === 0) {
    formGroup.append('<div class="alert alert-danger hidden"></div>')
  }
  const $alert = formGroup.children('.alert');
  const fileObj = fileControl instanceof jQuery ? fileControl[0] : fileControl;
  if(checkFileType(fileControl) !== 'document') {
    $alert.removeClass('hidden').html('<i class="fa fa-minus-circle"></i>'+ msg);
    return false;
  }else{
    $alert && $alert.remove()
    return true;
  }
}

//上传文件验证
const checkFile = function(fileControl, target){
  const formGroup = $(fileControl).parents('.form-group');
  const msg = '不支持该文件类型';
  if(formGroup.children('.alert').length === 0) {
    formGroup.append('<div class="col-md-3 alert alert-danger hidden"></div>')
  }
  const $alert = formGroup.children('.alert');
  if(!checkFileType(fileControl)) {
    $alert.removeClass('hidden').html('<i class="fa fa-minus-circle"></i>'+ msg);
    target && target.attr('data-status', 0)
    return false;
  }else{
    target && target.attr('data-status', 1)
    $alert.length === 1 && $alert.remove()
    return true;
  }
}

//上传图片预览
const uploadPreview = function(fileControl, $image){
  if(!hasFile(fileControl)) return;
  const reader = new FileReader();
  reader.onload = function(e){
    $image.attr('src', e.target.result)
  }
  reader.readAsDataURL(fileControl.files[0])
}
//清空上传控件的值
const clearFile = function($fileControl){
  const fileParent = $fileControl.parent();
  fileParent.append('<form></form>');
  const fileForm = fileParent.children('form');
  fileForm.append($fileControl)
  fileForm[0].reset()
  fileParent.prepend($fileControl)
  fileForm.remove()
  return true;
}

//图片格式大小验证
const checkImageRugular = function(fileControl, msg, regular, sizeLimit){
	/*
		fileControl   //file对象  
		msg         //错误信息提示
		regular     //图片格式正则表达式 默认 gif|jpg|jpeg|png
		sizeLimit   //图片尺寸大小限制   默认 1024K
	*/
  if(!hasFile(fileControl)) return true;
	if(!(fileControl instanceof jQuery || fileControl.nodeType === 1)) 
	throw new Error(fileControl + '不是DOM或jQuery对象！');
	const msgRegular = msg && msg.regular || '图片格式有误',
	 		msgSize = msg && msg.size || '图片大小超过限制',
	 		regular = regular || /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/,
	 		sizeLimit = sizeLimit || 1024;
	const formGroup = $(fileControl).parent();
	if(formGroup.children('.alert').length === 0) {
    formGroup.append('<div class="alert alert-danger hidden"></div>')
  }
  const $alert = formGroup.children('.alert');
  const fileObj = fileControl instanceof jQuery ? fileControl[0] : fileControl;
	const fileValue = fileObj.value,
	    fileSize = fileObj.files[0] && fileObj.files[0].size / 1024;
	if(!regular.test(fileValue)){
		$alert.removeClass('hidden').html('<i class="fa fa-minus-circle"></i>'+ msgRegular);
		return false;
	}else if(fileSize > sizeLimit){
		$alert.removeClass('hidden').html('<i class="fa fa-minus-circle"></i>'+ msgSize);
		return false;
	}
	$alert && $alert.remove()
	return true;
}

//图片上传校验
const checkImage = function(fileControl, msg, regular, sizeLimit){
  return checkFileRequired(fileControl, msg) && 
  checkImageRugular(fileControl, msg, regular, sizeLimit)
}

//倒计时 自动跳转到指定页
const countDown = function($target, router, count){
  const count = count || 5;
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