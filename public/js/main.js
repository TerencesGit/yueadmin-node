 (function() {
  $(function(){
    //侧边导航菜单自动切换
    var pageId = $('#main').attr('data-id');
    var _link = $('a[data-href= '+pageId+' ]');
    _link.parent('li').addClass('active').parents('li').addClass('open');
  })
   var toggle = false;
   var speed = 200;
   var $aside = $('#aside'),
       $main = $('#main'),
       $header = $('#header');
   //侧边栏显示隐藏
    $('#btnToggle').on('click', function() {
       if (!toggle) {
         $aside.animate({ 'left': -240 }, speed)
         $main.animate({ 'left': 0 }, speed)
         $header.animate({'left': 0 }, speed)
       }else{
         $aside.animate({ 'left': 0 }, speed)
         $main.animate({ 'left': 240 }, speed)
         $header.animate({'left': 240 }, speed)
       }
       toggle = !toggle 
    })
   // 返回顶部
   var backTop = $('#backTop');
   backTop.on('click', function(){
    $('html, body').animate({'scrollTop': 0}, speed)
   })
   //手风琴菜单
   var Accordion = function(element, multiple) {
     this.element = element || {};
     this.multiple = multiple || false;

     var links = this.element.find('.link');
     links.on('click', {
       element: this.element,
       multiple: this.multiple
     }, this.dropdown)
     var submenuItem = links.next('.submenu').find('li');
     submenuItem.on('click', function(){
       $(this).addClass('active').siblings().removeClass('active')
              .parents('li').siblings().find('.active').removeClass('active')
     })
   }
    Accordion.prototype.dropdown = function(e) {
      var $element = e.data.element;
      var $this = $(this),
          $next = $this.next();
      $next.slideToggle();
      $this.parent().toggleClass('open');
      if(!e.data.multiple) {
        $element.find('.submenu').not($next).slideUp().parent().removeClass('open');
      };  
    }
    new Accordion($('#accordion'));  
 })(jQuery)

//上传图片验证
function checkImage(){

}
//上传图片预览
function uploadPreview(fileInput, $Image){
  if(fileInput.files && fileInput.files[0]){
    var reader = new FileReader();
    reader.onload = function(e){
      $Image.attr('src', e.target.result)
    }
    reader.readAsDataURL(fileInput.files[0])
  }
}
//表单输入框验证
function checkInput($element, msg, pattern){
  if(!($element && msg)) throw new Error('至少两个参数！');
  var msgRequired = msg.required || '不能为空！',
      msgPattern = msg.pattern || '格式有误！';
  var value = $.trim($element.val());
  var formGroup = $element.parents('.form-group');
  if(formGroup.children('.alert').length === 0) {
    formGroup.append('<p class="col-md-3 alert alert-danger"></p>')
  }
  if(value == '') {
    formGroup.addClass('has-error').children('.alert').html('<i class="fa fa-warning"></i>'+msgRequired);
    $element.focus();
    return false;
  }else{
    if(pattern){
      if(!pattern.test(value)) {
        formGroup.addClass('has-error').children('.alert').html('<i class="fa fa-warning"></i>'+msgPattern);
        return false;
      }
    }
    formGroup.removeClass('has-error').children('.alert').remove();
    return true;
  }
}
//判断输入框两次输入是否一致
function confirmConsistent($element, $target, msg) {
  if(!($element && $target)) throw new Error('至少两个参数！');
  var msg = msg || '两次输入不一致';
  var value = $.trim($element.val()),
      targetValue = $.trim($target.val());
  var formGroup = $element.parents('.form-group');
  if (formGroup.children('.alert').length === 0) {
    formGroup.append('<p class="col-md-3 alert alert-danger"></p>')
  }
  if (value == '' || targetValue == '' || value !== targetValue) {
    formGroup.removeClass('has-success').addClass('has-error').children('.alert').html('<i class="fa fa-warning"></i>'+msg );
    return false;
  } else {
    formGroup.removeClass('has-error').addClass('has-success').children('.alert').remove();
    return true;
  }
}
//异步查询号码
var _number;//保存号码，防止相同号码多次触发ajax事件
function queryAccount($element, router, msg, $target){
  if(!($element && router)) throw new Error('至少两个参数！');
  var msgExisted = msg && msg.existed || '该号码已存在';
  var number = $.trim($element.val());
  if(_number == number) return;
   _number = number;
  var formGroup = $element.parents('.form-group');
  if (formGroup.children('.alert').length === 0) {
    formGroup.append('<p class="col-md-3 alert alert-danger hidden"></p>')
  }
  $.ajax({
    url: '/'+router,
    data: {number: number}
  })
  .done(function(res){
      if(res.status == 1){
        formGroup.removeClass('has-success').addClass('has-error').children('.alert').removeClass('hidden')
                   .html('<i class="fa fa-warning"></i>'+msgExisted);
        if($target) $target.attr('data-status', 0);
      }
      if(res.status == 2){
        formGroup.removeClass('has-error').addClass('has-success').children('.alert').remove();
        if($target) $target.attr('data-status', 2);
      }
  })
  .fail(function(err){
    console.log(err)
  })
}