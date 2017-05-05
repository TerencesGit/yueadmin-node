/* 公告信息管理 */
const noticeDataTable = $('#noticeDataTable');
$(function(){
	noticeDataTable.length === 1 &&　noticeDataTable.dataTable()
})
// 公告发布表单
const noticeForm = $('#noticeForm'),
			noticeTitle = $('#noticeTitle'),
			noticeCont = $('#noticeCont'),
			fileControl = $('.file-control'),
			previewArea = $('.preview-area'),
			picPreview = $('.img-preview'),
			imgRemove = $('.img-remove'),
			noticeSubmit = $('#noticeSubmit');
noticeSubmit.on('click', function(e){
	e.preventDefault();
	checkInput(noticeTitle) && 
	checkInput(noticeCont) &&
	checkImageRegular(fileControl) &&
	noticeForm.submit()
})	
 //点击选择本地图片
  previewArea.on('click', function(e){
     $(this).parents('.form-group').find('.file-control').click()
  })
  //图片预览
  fileControl.change(function(e){
    const picPreview = $(this).parents('.form-group').find('.img-preview');
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

//公告删除	
const btnResetNotice = $('.btn-remove-notice');
btnResetNotice.on('click', function(e){
	var $tr = $(this).parents('tr');
	var id = $tr.attr('data-id');
	$.dialog().confirm({message: '确定删除该条公告, 此操作不可恢复'})
   .on('confirm', function(){
   	removeNoticeById(id, $tr)
   })
})
function removeNoticeById(id, $tr){
	$.ajax({
		url: '/system/notice_remove?id='+id,
	})
	.done(function(res) {
		if(res.status == 1){
			$.dialog().success({message: '删除成功', delay: 1000})
			setTimeout(function(){
				if($tr.length === 1){
					$tr.remove()
				}
			}, 1000)
		}else{
			$.dialog().alert({message: '删除失败，请稍后重试'})
		}
		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}	