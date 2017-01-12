var Message = require('../models/message');
exports.home = function(req, res){
	res.render('message/home', {title: '发表留言'})
}
//去除前后空格
function Trim(str){ 
  return str.replace(/(^\s*)|(\s*$)/g, ""); 
}
exports.save = function(req, res){
	var _user = req.session.user;
	var _message = req.body.message;
	_message.content = Trim(_message.content);
	_message.user = _user._id;
	console.log(_message)
	var message = new Message(_message);
	message.save(function(err, message){
		if(err) return err;
		res.redirect('/')
	})
}
exports.delete = function(req, res){
	var id = req.query.id;
	console.log(id);
	if(id){
		Message.remove({_id: id}, function(err, message){
			if(err) console.log(err)
			res.json({status: 1})
		})
	}
}