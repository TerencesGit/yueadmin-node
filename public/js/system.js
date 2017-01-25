
var newFunctionModal = $('#newFunctionModal'),
		newFunctionName = $('#newFunctionName'),
		newFunctionDesc = $('#newFunctionDesc'),
		newFunctionBtn = $('#newFunctionBtn');
newFunctionBtn.on('click', function(e){
	e.preventDefault();
	if(!(simpleCheckInput(newFunctionName) && simpleCheckInput(newFunctionDesc))) return false;
	var name = $.trim(newFunctionName.val()),
				desc = $.trim(newFunctionDesc.val());
		var func = {
			name: name,
			desc: desc,
		}
		$.ajax({
			url: '/system/new_function',
			type: 'post',
			data: {func: func},
		})
		.done(function(res) {
			console.log("success");
		})
		.fail(function(error) {
			console.log("error");
		})
})