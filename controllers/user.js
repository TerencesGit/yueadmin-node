var User = require('../models/user');

exports.showSignup = function(req, res, next){
	res.render('signup', {title: '欢迎注册'})
}
exports.showSignin = function(req, res, next){
	res.render('signin', {title: '欢迎登录'})
}
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
				res.render('signin')
			})
		}
	})
}
exports.signin = function(req, res){
	var name = req.body.name;
	var passwd = req.body.password;
	User.findOne({name: name},function(err, user){
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