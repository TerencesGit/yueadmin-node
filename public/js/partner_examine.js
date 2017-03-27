//商家审核
//审核切换按钮
$('.btn-examine').on('click', function(){
  const $this = $(this);
  const id = this.id;
  if(!$this.hasClass('active')){
    $this.addClass('active').siblings().removeClass('active')
    $('#'+id+'PartnerForm').removeClass('hidden').siblings('form').addClass('hidden')
  }
})
//审核通过提交
$('#throughPartBtn').on('click', function(e){
	e.preventDefault();
	const partType = $('input[type="radio"]:checked');
	if(partType.length === 1){
		console.log(partType.val())
		$('#throughPartnerForm').submit()
	}else{
		alert('请选择商家类型')
	}
})
//审核驳回提交
const rejectInfo = $('#rejectInfo');
const rejectFormGroup = rejectInfo.parents('.form-group');
$('#rejectPartBtn').on('click', function(e){
	e.preventDefault();
	if($.trim(rejectInfo.val()).length >= 10){
		$('#rejectPartnerForm').submit()
	}else{
		rejectFormGroup.addClass('has-error')
	}
})
rejectInfo.focus(function(){
	rejectFormGroup.removeClass('has-error')
})