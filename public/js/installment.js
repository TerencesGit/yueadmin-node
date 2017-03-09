/* 公共侧边栏与头部 */
//侧边导航菜单根据页面内容切换
$(function(){
  const dataPage = $('#main').data('page');
  const _link = $('a[data-href= '+dataPage+' ]');
  _link.parent('li').addClass('active').parents('li').addClass('open');
})
var toggle = false;
const speed = 200;
const $aside = $('#aside'),
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
const backTop = $('#backTop');
backTop.on('click', function(){
  $('html, body').animate({'scrollTop': 0}, speed)
})
//手风琴菜单
const Accordion = function(element, multiple) {
 this.element = element || {};
 this.multiple = multiple || false;
 const links = this.element.find('.link');
 links.on('click', {
   element: this.element,
   multiple: this.multiple
 }, this.dropdown)
 const submenuItem = links.next('.submenu').find('li');
 submenuItem.on('click', function(){
   $(this).addClass('active').siblings().removeClass('active')
          .parents('li').siblings().find('.active').removeClass('active');
 })
}
Accordion.prototype.dropdown = function(e) {
  const $element = e.data.element;
  const $this = $(this),
        $next = $this.next();
  $next.slideToggle();
  $this.parent().toggleClass('open');
  if(!e.data.multiple) {
    $element.find('.submenu').not($next).slideUp().parent().removeClass('open');
  };  
}
new Accordion($('#accordion'));

//头部公告滚动
const noticeWapper = $('#noticeWapper'),
      noticeList = $('#noticeList');
const noticeLen = noticeList.find('li').length;
const initHeight = noticeList.find('li').first().outerHeight(true);
const SCROLL_SPEED = 3000;
var noticeTimer;
function autoScroll(){
  if(noticeLen <=1 ) return;
  noticeList.animate({
    marginTop: -initHeight},
    500, function() {
      $(this).css({marginTop : 0}).find("li:first").appendTo(this);
  });
}
noticeList.hover(function(){
  clearInterval(noticeTimer)
}, function(){
  clearInterval(noticeTimer)
  noticeTimer = setInterval(autoScroll, SCROLL_SPEED);
})
noticeTimer = setInterval(autoScroll, SCROLL_SPEED);

//生成验证码
var code;  //保存验证码
const createCode = function(codeLength) {
  codeLength = codeLength || 4;
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
  cxt.fillText(createCode(), 8, 24)
}
//判断是否上传文件
const hasFile = function(fileControl){
  fileControl = fileControl instanceof jQuery ? fileControl[0] : fileControl;
  return fileControl.files && fileControl.files[0];
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
$('#merchantDataTable').length === 1 && $('#merchantDataTable').dataTable();
$('#accountDataTable').length === 1 && $('#accountDataTable').dataTable();
$('.btn-status').on('click', function(e){
  if($(this).hasClass('on')){
    $(this).removeClass('on').find('.fa').removeClass('fa-toggle-on').addClass('fa-toggle-off');
  }else{
    $(this).addClass('on').find('.fa').removeClass('fa-toggle-off').addClass('fa-toggle-on');
  }
})
$('.preview-area').on('click', function(e){
   $(this).parents('.form-group').find('.file-control').click()
})
$('.file-control').change(function(e){
  const picPreview = $(this).parents('.form-group').find('.pic-preview');
  uploadPreview(this, picPreview)
  picPreview.parent().addClass('show');
})