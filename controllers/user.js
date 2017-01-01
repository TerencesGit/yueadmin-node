var User = require('../models/user');
var fs = require('fs');
var path = require('path');

exports.showSignup = function(req, res, next){
	res.render('signup', {title: '欢迎注册'})
}
exports.showSignin = function(req, res, next){
	res.render('signin', {title: '欢迎登录', msg: ''})
}
//查询邮箱号
exports.findByEmail = function(req, res, next){
	var email = req.query.email;
	User.findOne({email: email}, function(err, user){
		if(err) console.log(err)
			if(user){
				res.json({status: 1})
			}else{
				res.json({status: 2})
			}
	})
}

//发送手机验证码
var code;
exports.sendPhoneCode = function(req, res){
	var mobile = req.query.mobile;
	code = createCode();
	var interval = getRandom(3, 8) * 1000;
	setTimeout(function(){
		res.json({code: code})
	},interval)
}
function createCode() {
  const codeLength = 4;
  const alphabet = '1234567890';
  code = '';
  for (var i = 0, len = alphabet.length; i < codeLength; i++) {
    code += alphabet.charAt(Math.floor(Math.random() * len))
  }
  return code;
}
//随机数范围
function getRandom(min, max){;
	return Math.floor(Math.random() * (max - min)) + min;
}
//注册功能
exports.signup = function(req, res){
	var _user = req.body.user;
	var email = _user.email;
	//var phonecode = _user.phonecode;
	// console.log(phonecode)
	// console.log(code)
	// if(phonecode !== code){
	// 	_user.error = '手机验证码错误';
	// 	return res.render('signup', {title: '欢迎注册', user: _user, })
	// } 
	_user.name = email;
	User.findOne({email: email}, function(err, user){
		if(err) console.log(err)
		if(!user){
			var user = new User(_user);
			user.save(function(err, user){
				if(err) console.log(err)
				res.render('signin',{title: '欢迎登录', msg: '注册成功，'})
			})
		}else {
			console.log('该邮箱号已注册')
		}
	})
}
//登录功能
exports.signin = function(req, res){
	var name = req.body.username;
	var passwd = req.body.password;
	var emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
	if(!emailReg.test(name)){
		User.findOne({mobile: name},function(err, user){
			if(err) console.log(err)
				if(!user){
					return res.json({status: 0})
				}
				console.log(user)
				user.comparePassword(passwd, function(err, isMatch){
					if(err) console.log(err)
					if(isMatch){
						req.session.user = user;
						setTimeout(function(){
							return res.json({status: 2})
						},2000)
					}else{
						return res.json({status: 1})
					}
				})
		})
	}else{
		User.findOne({email: name},function(err, user){
			if(err) console.log(err)
				if(!user){
					return res.json({status: 0})
				}
				console.log(user)
				user.comparePassword(passwd, function(err, isMatch){
					if(err) console.log(err)
					if(isMatch){
						req.session.user = user;
						setTimeout(function(){
							res.json({status: 2})
						},2000)
					}else{
						res.json({status: 1})
					}
				})
		})
	}
}
function signin(filed, value){

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
//信息修改
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
exports.showUpdate = function(req, res){
	res.render('account/update_passwd',{title: '修改密码'})
}
//修改密码
exports.updatePassword = function(req, res){
	var user = req.session.user;
	var userObj = req.body.user;
	var passwd = userObj.oldpasswd;
	var newPasswd = userObj.newpasswd;
	console.log(userObj)
	User.findOne({_id: user._id},function(err, user){
		if(err) console.log(err)
			if(!user){
				return res.redirect('/signin')
			}
			user.comparePassword(passwd, function(err, isMatch){
				if(err) console.log(err)
				if(isMatch){
					user.password = newPasswd;
					user.save(function(err, user){
						if(err) console.log(err)
						req.session.user = '';
		  			res.redirect('/')
					})
				}else{
					console.log('密码不正确')
					userObj.error = '密码不正确';
					return res.render('account/update_passwd',{title: '修改密码', user: userObj})
				}
			})
	})
}
//登录验证
exports.signinRequired = function(req, res, next){
	var user = req.session.user;
	if(!user){
		return res.redirect('/signin')
	}
	next()
}
//权限控制
exports.adminRequired = function(req, res, next){
	var user = req.session.user;
	if(user.role < 20){
		return res.redirect('/signup')
	}
}
exports.showAccountInfo = function(req, res){
	res.render('account/account_info', {title: '账户信息'})
}
//账户信息编辑
exports.showEdit = function(req, res){

	res.render('account/account_info_edit', {title: '账户信息编辑'})
}

//头像上传
exports.avatarUpload = function(req, res, next){
	var user = req.session.user;
	var avatarData = req.files.avatar;
	console.log(avatarData)
	var filePath = avatarData.path;
	var originalFile =avatarData.originalFilename;
	if(originalFile){
		fs.readFile(filePath, function(err, data){
			var timestamp = Date.now()
			var type = avatarData.type.split('/')[1];
			var avatar = timestamp + '.' +type;
			var newPath = path.join(__dirname, '../', 'public/upload/' + avatar);
			fs.writeFile(newPath, data, function(err){
				User.update({_id: user._id},{'$set': {avatar: avatar}}, function(err, msg){
					if(err) return err;
					user.avatar = avatar;
					res.redirect('/account/edit')
				})
			})
		})
	}else{
		next()
	}
}
exports.conpanyIofo = function(req, res){
	res.render('company/company_info', {title: '企业信息'})
}	
exports.departdment = function(req, res){
	res.render('company/department', {title: '部门管理'})
}