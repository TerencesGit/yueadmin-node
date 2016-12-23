var User = require('../models/user');

exports.showSignup = function(req, res, next){
	res.render('signup', {title: '欢迎注册'})
}
exports.showSignin = function(req, res, next){
	res.render('signin', {title: '欢迎登录'})
}
//查询手机号
exports.findByMobile = function(req, res, next){
	var mobile = req.query.mobile;
	User.findOne({mobile: mobile}, function(err, user){
		if(err) console.log(err)
			if(user){
				res.json({status: 1})
			}else{
				res.json({status: 2})
			}
	})
}
//注册功能
exports.signup = function(req, res){
	var _user = req.body.user;
	console.log(_user)
	_user.name = _user.mobile;
	User.findOne({mobile: _user.mobile}, function(err, user){
		if(err) console.log(err)
		if(!user){
			var user = new User(_user);
			user.save(function(err, user){
				if(err) console.log(err)
				res.render('signin',{title: '欢迎登录'})
			})
		}
	})
}
//登录功能
exports.signin = function(req, res){
	var name = req.body.username;
	var passwd = req.body.password;
	User.findOne({mobile: name},function(err, user){
		if(err) console.log(err)
			if(!user){
				return res.json({status: 0})
			}
			user.comparePassword(passwd, function(err, isMatch){
				if(err) console.log(err)
				if(isMatch){
					req.session.user = user;
					res.json({status: 2})
				}else{
					res.json({status: 1})
				}
			})
	})
}
exports.home = function(req, res){
	res.redirect('/')
}
//用户列表
exports.userlist = function(req, res){
	User.fetch(function(err, users){
		res.render('userlist', {
			title: '用户列表',
			users: users
		})
	})
}
//用户登出
 exports.logout = function(req, res){
 	delete req.session.user;
	res.redirect('/signin')
 }
exports.delete = function(req, res){
	var uid = req.query.uid;
	if(uid){
		User.remove({_id: uid}, function(err, user){
			if(err) console.log(err)
			res.json({status: 1})
		})
	}
}
exports.edit = function edit(req, res){
	var _user = req.body.user;
	var uid = _user.id;
	var name = _user.name;
	var role = _user.role;
	User.update({_id: uid}, {'$set': {name: name, role: role}},function(err, user){
		if(err) return err;
		res.redirect('/user/list')
	})
}