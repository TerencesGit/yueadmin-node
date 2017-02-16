/* 公告信息维护 */
// 公告发布表单
const noticeForm = $('#noticeForm'),
			noticeTitle = $('#noticeTitle'),
			noticeCont = $('#noticeCont'),
			noticeFile = $('#noticeFile'),
			noticePic = $('#noticePic'),
			noticePicPreview = $('#noticePicPreview'),
			noticePicUpload = $('#noticePicUpload'),
			removeFileBtn = $('#removeFileBtn'),
			noticeSubmit = $('#noticeSubmit');
noticeSubmit.on('click', function(e){
	e.preventDefault();
	checkInput(noticeTitle) && 
	checkInput(noticeCont) &&
	checkImageRugular(noticeFile) &&
	noticeForm.submit()
})	
//公告图片预览
noticePicPreview.on('click', function(e){
	noticeFile.click()
})
noticePicUpload.on('click', function(e){
	noticeFile.click()
})
noticeFile.change(function(){
	checkImageRugular(this) &&
	uploadPreview(this, noticePic)
	noticePicPreview.show().addClass('show')
	noticePicUpload.hide()
})
//清空上传文件
removeFileBtn.on('click', function(e){
	e.stopPropagation();
	noticePicPreview.hide();
	noticePicUpload.show();
	clearFile(noticeFile);
	noticePic.attr('src', '');
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