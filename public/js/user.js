//用户删除
$('.btn-del').on('click', function(){
	var $tr = $(this).parents('tr');
	var name = $tr.children().eq(0).text();
	modalfadeIn()
	var uid = $tr.attr('data-id');
	var msg = confirm('确定删除用户' + name + '？')
	if(msg){
		$.ajax({
			url: '/user/delete',
			data: {uid: uid},
		})
		.done(function(res) {
			console.log(res.status);
			if(res.status == 1){
				if($tr.length === 1){
					$tr.remove()
				}
			}
		})
		.fail(function() {
			console.log("error");
		})
	}else{
		return false
	}
})
//用户编辑
$('.btn-eidt').on('click', function(){
	var $tr = $(this).parents('tr');
	var uid = $tr.attr('data-id');
	var name = $tr.children().eq(0).text();
	var role = $tr.children().eq(3).text();
	var $modal = $('#myModal');
	var IdInput = $modal.find('#uid')
	var nameInput = $modal.find('.username');
	var roleInput = $modal.find('.role');
	IdInput.val(uid);
	nameInput.val(name);
	roleInput.val(role)
})
//信息提示
function modalfadeIn(){
	$('.mask').fadeIn().find('.mask-container').css({'transform': 'scale(1,1)'})
	setTimeout(function(){
		$('.mask').fadeOut().find('.mask-container').css({'transform': 'scale(0,0)'})
	},1000)
}
//修改密码
var oldPasswdInput = $('#oldPasswd'),
    newPasswdInput = $('#newPasswd'),
    confirmPasswdInput = $('#confirmPasswd'),
    updateForm = $('#updateForm'),
    btnSubmit = $('#btnSubmit');
function checkForm(element){
	var value = $.trim($(element).val());
	var fromGroup = $(element).parents('.form-group');
  if(value == '') {
  	fromGroup.addClass('error');
    $(element).focus();
    return false;
  }else{
  	fromGroup.removeClass('error');
    return true;
  }
}
function confrimPasswd(){
	var passwd = $.trim(newPasswdInput.val());
	var passwd2 = $.trim(confirmPasswdInput.val());
	if(passwd == '' || passwd2 == '' || passwd !== passwd2){
		confirmPasswdInput.parents('.from-group').addClass('error')
		return false
	}else{
		confirmPasswdInput.parents('.from-group').removeClass('error')
		return true
	}
}
btnSubmit.on('click', function(e){
	//e.preventDefault();
	checkForm(oldPasswdInput) && checkForm(newPasswdInput) && 
	confrimPasswd() && updateForm.submit()
})