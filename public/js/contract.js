/* 合同管理 */
//合同模板表单
const templateForm = $('#templateForm'),
			templateTitle = $('#templateTitle'),
			templateFileType = $('#templateFileType'),
			templateDesc = $('#templateDesc'),
			contractFile = $('#contractFile'),
			templatePreview = $('#templatePreview'),
			templateUpload = $('#templateUpload'),
			removeFileBtn = $('#removeFileBtn'),
			templateSubmit = $('#templateSubmit');
//模板表单提交			
templateSubmit.on('click', function(e){
	e.preventDefault();
	checkInput(templateTitle) &&
	checkFileRequired(contractFile) &&
	checkFile(contractFile) && alert('submit')
})
//合同模板上传
templateUpload.on('click', function(){
	contractFile.click()
})
contractFile.change(function(){
	checkFile(this) && templatePreview.show()
})
removeFileBtn.on('click', function(e){
	e.stopPropagation();
	clearFile($(contractFile)) && templatePreview.hide()
})
/* 合同录入 */
//合同表单
const signDate = $('#signDate'),
			effetiveDate = $('#effetiveDate'),
			expireDate = $('#expireDate');
//日期选择器
var sign = {
  elem: '#signDate',
  max: laydate.now(),
  choose: function(datas){
     effetive.min = datas;
  }
};
var effetive = {
  elem: '#effetiveDate',
  choose: function(datas){
     expire.min = datas;
     expire.start = datas;
  }
};
var expire = {
  elem: '#expireDate',
  min: laydate.now(),
  choose: function(datas){
     effetive.max = datas;
     effetive.end = datas;
  }
};
laydate(sign)
laydate(effetive)
laydate(expire)