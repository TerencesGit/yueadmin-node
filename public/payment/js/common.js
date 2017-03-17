//输入框实时验证
function checkRealTime($element, msg, regular, callback, $target){
  const formGroup = $element.parents('.form-group');
  const inputTip = formGroup.children('.input-tip');
  $element.focus(function(){
    if($.trim($element.val()) == ''){
      formGroup.hasClass('has-error') && formGroup.removeClass('has-error');
      inputTip.hasClass('alert-danger') && inputTip.removeClass('alert-danger');
      !(inputTip.hasClass('alert-info')) && inputTip.addClass('alert-info');
      inputTip.html('<i class="fa fa-exclamation-circle"></i>'+msg.tip)
    }
  }).blur(function(){
    if($.trim($element.val()) == ''){
      inputTip.removeClass('alert-info').html('');
    }else{
      $target ? callback($element, $target, msg) : callback($element, msg, regular)
    }
  })
  if($element.length === 1){
    $element[0].oninput = function(){
      formGroup.hasClass('has-error') && formGroup.removeClass('has-error');
      inputTip.hasClass('alert-danger') && inputTip.removeClass('alert-danger');
      !(inputTip.hasClass('alert-info')) && inputTip.addClass('alert-info');
      inputTip.html('<i class="fa fa-exclamation-circle"></i>'+msg.tip)
    }
  }
}
//输入框验证
function checkInput($element, msg, regular){
  const msgRequired = msg && msg.required || '该项为必填';
  const msgRegular = msg && msg.regular || '输入格式有误';
  const formGroup = $element.parents('.form-group');
  const $tip = formGroup.children('.input-tip');
  const value = $.trim($element.val());
  $tip.hasClass('alert-info') && $tip.removeClass('alert-info');
  !($tip.hasClass('alert-danger')) && $tip.addClass('alert-danger');
  if(value == ''){
    formGroup.removeClass('has-success').addClass('has-error');
    $tip.html('<i class="fa fa-minus-circle"></i>'+msgRequired);
    return false;
  }else{
    if(regular){
      if(!regular.test(value)){
        formGroup.removeClass('has-success').addClass('has-error');
        $tip.html('<i class="fa fa-minus-circle"></i>'+msgRegular);
        return false;
      }
    }
     formGroup.removeClass('has-error').addClass('has-success');
        $tip.removeClass('alert-danger').html('');
        return true;
  }
}
//支付密码验证
function checkPayPassword($element, msg, regular){
  const formGroup = $element.parents('.form-group');
  const $tip = formGroup.children('.input-tip');
  const value = $.trim($element.val());
  $tip.hasClass('alert-info') && $tip.removeClass('alert-info');
  !($tip.hasClass('alert-danger')) && $tip.addClass('alert-danger');
  formGroup.removeClass('has-success').addClass('has-error');
  if(value == ''){
    $tip.html('<i class="fa fa-minus-circle"></i>'+msg.required);
    return false;
  }else if(!regular.test(value)){
    $tip.html('<i class="fa fa-minus-circle"></i>'+msg.regular);
    return false;
  }else if(isSameNumber(value)){
    $tip.html('<i class="fa fa-minus-circle"></i>'+msg.same);
    return false;
  }else if(isContinuationInteger(value)){
    $tip.html('<i class="fa fa-minus-circle"></i>'+msg.continuity);
    return false;
  }else{
    formGroup.removeClass('has-error').addClass('has-success');
    $tip.removeClass('alert-danger').html('');
    return true;
  }
}
//确认密码验证
function confirmPassword($element, $target, msg){
  const formGroup = $element.parents('.form-group');
  const $tip = formGroup.children('.input-tip');
  const value = $.trim($element.val()),
        targetValue = $.trim($target.val());
  $tip.hasClass('alert-info') && $tip.removeClass('alert-info');
  !($tip.hasClass('alert-danger')) && $tip.addClass('alert-danger');
  if(value == ''){
    formGroup.removeClass('has-success').addClass('has-error');
    $tip.html('<i class="fa fa-exclamation-circle"></i>'+ msg.required);
    return false;
  }else if(value !== targetValue){
    formGroup.removeClass('has-success').addClass('has-error');
    $tip.html('<i class="fa fa-exclamation-circle"></i>'+ msg.inconsistent);
    return false;
  }else{
    formGroup.removeClass('has-error').addClass('has-success');
    $tip.removeClass('alert-danger').html('');
    return true;
  }
}
//判断多选框是否被选中
function isCkecked($element, msg){
  const formGroup = $element.parents('.form-group');
  const $tip = formGroup.children('.input-tip');
  const checked = $element.prop('checked');
  if(!checked){
    $tip.addClass('alert-danger')
        .html('<i class="fa fa-exclamation-circle"></i>'+ msg.check);
    return false;
  }else{
    $tip.removeClass('alert-danger').html('')
    return true;
  }
}
//判断单选框是否被选中
function isRadioChecked($element, name, msg){
  const formGroup = $element.parents('.form-group');
  const $tip = formGroup.children('.input-tip');
  const checked = $('input[name="'+name+'"]:checked');
  if(checked.length === 0){
    $tip.addClass('alert-danger')
        .html('<i class="fa fa-exclamation-circle"></i>'+ msg.required);
    return false;
  }else{
    $tip.removeClass('alert-danger').html('')
    return true;
  }
}
//检测是否为连续数字
function isContinuationInteger(arr){
  if(typeof arr === 'string'){
    arr = arr.split('');
  }
  if(!Array.isArray(arr)) throw new Error(arr+'不是数组！');
  let len = arr.length;
  let arrFirst = parseInt(arr[0]);
  let arrLast = parseInt(arr[len-1]);
  let sortDirection = 1;
  if(arrFirst > arrLast){
    sortDirection = -1;
  }
  if(arrFirst + (len-1)*sortDirection !== arrLast){
    return false;
  }
  let isContinuation = true;
  for(let i = 0; i < len; i++){
    if(parseInt(arr[i]) !== i*sortDirection + arrFirst){
      isContinuation = false;
      break;
    }
  }
  return isContinuation;
}
//检测是否是相同数字或字母
function isSameNumber(arr){
  if(typeof arr === 'string'){
    arr = arr.split('');
  }
  if(!Array.isArray(arr)) throw new Error(arr+'不是数组！');
  var arr0 = arr[0];
  var isSame = true;
  for(let i = 0; i < arr.length; i++){
    if(arr[i] !== arr0 ){
      isSame = false;
      break;
    }
  }
  return isSame;
}