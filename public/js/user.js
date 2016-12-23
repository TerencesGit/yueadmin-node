$('.btn-del').on('click', function(){
	var $tr = $(this).parents('tr');
	var name = $tr.children().eq(0).text();
	console.log(name)
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
function modalfadeIn(){
	$('.mask').fadeIn().find('.mask-container').css({'transform': 'scale(1,1)'})
	setTimeout(function(){
		$('.mask').fadeOut().find('.mask-container').css({'transform': 'scale(0,0)'})
	},1000)
}