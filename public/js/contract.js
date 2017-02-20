/* 合同管理 */
const templateDataTable = $('#templateDataTable');
const contractDataTable = $('#contractDataTable');
$(function(){
	templateDataTable.length === 1 && templateDataTable.DataTable({})
	contractDataTable.length === 1 && contractDataTable.DataTable({})
})
//合同模板表单
const templateForm = $('#templateForm'),
			templateTitle = $('#templateTitle'),
			templateFileType = $('#templateFileType'),
			templateDesc = $('#templateDesc'),
			contractFile = $('#contractFile'),
			templatePreview = $('#templatePreview'),
			templateUpload = $('.template-upload'),
			templateSubmit = $('#templateSubmit');
//模板表单提交			
templateSubmit.on('click', function(e){
	e.preventDefault();
	checkInput(templateTitle) &&
	checkFileRequired(contractFile) &&
	checkDocument(contractFile) && 
	templateForm.submit()
})
//模板上传
templateUpload.on('click', function(){
	contractFile.click()
})
contractFile.change(function(){
	checkDocument(this)
	showFileName(this, getFileName(this))
	$('#fileName').val(getFileName(this))
})
//合同模板编辑
const templateEditBtn = $('#templateEditBtn');
templateEditBtn.on('click', function(e){
	e.preventDefault();
	checkInput(templateTitle) &&
	templateForm.submit()
})
//合同模板删除
const removeBtn = $('.btn-remove');
removeBtn.on('click', function(e){
  let _this = $(this);
  e.preventDefault();
  $.dialog().confirm({message: '确定删除该模板'})
   .on('confirm', function(){
      location.href = _this.attr('href');
   })
})
/* 合同录入页 */
//合同表单
const contractForm = $('#contractForm'),
			partyAName = $('#partyAName'),
			partyBName = $('#partyBName'),
			partyCName = $('#partyCName'),
			signDate = $('#signDate'),
			effetiveDate = $('#effetiveDate'),
			expireDate = $('#expireDate'),
			contractTemplate = $('#contractTemplate'),
			attachFile = $('.attach-file'),
			attachUploadBtn = $('.attach-upload'),
			contractSubmit = $('#contractSubmit');
const regular = {
	name: /^[\u4E00-\u9FA5A-Za-z]+$/,
	date: /^\d{4}-\d{1,2}-\d{1,2}/,
}
const msg = {
	name: {
		regular: '姓名只能是中文或英文',
	},
	date: {
		regular: '日期格式不正确',
	}
}
//合同表单提交
contractSubmit.on('click', function(e){
	e.preventDefault()
	if($(this).attr('data-status') == '0') return;
	checkContractForm() && contractForm.submit()
})
//合同表单验证
function checkContractForm(){
	return checkInput(partyAName, msg.name, regular.name) &&
	checkInput(partyBName, msg.name, regular.name) &&
	checkInputValue(partyCName, msg.name, regular.name) &&
	checkInput(signDate, msg.date, regular.date) &&
	checkInput(effetiveDate, msg.date, regular.date) &&
	checkInput(expireDate, msg.date, regular.date)
}
//附件上传
attachUploadBtn.on('click', function(){
	$(this).parents('.form-group').find('input[type="file"]').click()
})
attachFile.change(function(){
	checkFile(this, contractSubmit)
	showFileName(this, getFileName(this))
})
function showFileName(fileControl, name){
	$(fileControl).next('.input-group').children('.file-name').val(name);
}
//合同删除
const removeContractBtn = $('.btn-contract-remove');
removeContractBtn.on('click', function(e){
	const _this = $(this);
	e.preventDefault();
	$.dialog().confirm({message: '确定删除该合同？'})
	 .on('confirm', function(){
	 	  location.href = _this.attr('href');
	 })
})