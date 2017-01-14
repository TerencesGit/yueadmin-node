var User = require('../models/user');
var Message = require('../models/message');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

//注册页
exports.showSignup = function(req, res, next){
	res.render('signup', {title: '欢迎注册'})
}
//登录页
exports.showSignin = function(req, res, next){
	res.render('signin', {title: '欢迎登录'})
}
//查询邮箱号
exports.findByEmail = function(req, res, next){
	var email = Trim(req.query.number);
	User.findOne({email: email}, function(err, user){
		if(err) console.log(err)
		if(user){
			res.json({status: 1})
		}else{
			res.json({status: 2})
		}
	})
}
//查询手机号
exports.findByMobile = function(req, res, next){
	var mobile = Trim(req.query.number);
	User.findOne({mobile: mobile}, function(err, user){
		if(err) console.log(err)
		if(user){
			res.json({status: 1})
		}else{
			res.json({status: 2})
		}
	})
}
//发送验证码
exports.sendPhoneCode = function(req, res){
	var user = req.session.user;
	var mobile = req.query.mobile;
	var code = createCode();
	user.code = code;
	var interval = getRandom(3, 8) * 1000;
	setTimeout(function(){
		res.json({code: code})
	},interval)
}
//生成验证码
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
//去除前后空格
function Trim(str){ 
  return str.replace(/(^\s*)|(\s*$)/g, ''); 
}
//注册功能
exports.signup = function(req, res){
	var _user = req.body.user;
	var email = Trim(_user.email);	
	User.findOne({email: email}, function(err, user){
		if(err) console.log(err)
		if(!user){
			_user.name = email;
			var user = new User(_user);
			user.save(function(err, user){
				if(err){
					_user.error = '注册失败，系统错误';
					return res.render('signup', {title: '欢迎注册', user: _user})
				}
				req.session.user = user;
				res.redirect('/')
			})
		}else {
			_user.error = '注册失败，该邮箱号已经被注册！';
		  res.render('signup', {title: '欢迎注册', user: _user})
		}
	})
}
//异步登录功能
exports.signinAsync = function(req, res){
	var _user = req.body.user;
	var name = _user.name,
	    passwd = _user.passwd;
	var emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
	if(!emailReg.test(name)){
		User.findOne({mobile: name},function(err, user){
			if(err) console.log(err)
			if(!user){
				return res.json({status: 0})
			}
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
//同步登录功能
exports.signin = function(req, res){
	var _user = req.body.user;
	var name = _user.username,
			passwd = _user.password;
	console.log(_user);
	var emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
	if(!emailReg.test(name)){
		User.findOne({mobile: name}, function(err, user){
			if(err) return err;
			if(!user){
				_user.error = '用户名不存在！'
				return res.render('signin', {title: '欢迎登录', user: _user})
			}
			user.comparePassword(passwd, function(err, isMatch){
				if(err) return err;
				if(isMatch){
					req.session.user = user;
					res.redirect('/')
				}else{
					_user.error = '密码不正确！';
					return res.render('signin', {title: '欢迎登录', user: _user})
				}
			})
		})
	}else{
		User.findOne({email: name}, function(err, user){
			if(err) return err;
			if(!user){
				_user.error = '用户名不存在！'
				return res.render('signin', {title: '欢迎登录', user: _user})
			}
			user.comparePassword(passwd, function(err, isMatch){
				if(err) return err;
				if(isMatch){
					console.log(user)
					req.session.user = user;
					res.redirect('/')
				}else{
					_user.error = '密码不正确！';
					return res.render('signin', {title: '欢迎登录', user: _user})
				}
			})
		})
	}
}
//绑定手机号
exports.bindMobile = function(req, res){
	var _user = req.body.user,
	    mobile = _user.mobile,
		  phonecode = Trim(_user.phonecode);
	var userObj = req.session.user,
		  id = userObj._id,
		  usercode = userObj.code;
	if(id){
		if(phonecode !== usercode){
			console.log( '手机验证码错误')
			userObj.error = '手机验证码有误！';
			return res.render('account/account_bind', {title: '账号绑定', tabIndex: 1, user: userObj})
		}
		User.update({_id: id}, {'$set': {mobile: mobile}}, function(err, msg){
			if(err) return err;
			userObj.mobile = mobile;
			userObj.success = '手机号绑定成功！';
			req.session.user = userObj;
			console.log('绑定成功！')
		  return res.render('account/account_bind', {title: '账号绑定', tabIndex: 1, user: userObj})
		})
	}else {
		res.redirect('/signin')
	} 
}
//验证邮箱
exports.verifiedEmail = function(req, res){
	var email = req.query.email;
	User.findOne({email: email}, function(err, user){
		if(user){
			User.update({email: email}, {'$set': {email_verified: 1}}, function(err, msg){
				if(err) return err;
				console.log('邮箱验证成功！')
				req.session.user = user;
				res.redirect('/account/account_bind')
			})
		}else{
			res.redirect('/account')
		}
	})
}
//修改邮箱页
exports.showModifyEmail = function(req, res){
	res.render('account/account_bind', {title: '账号绑定', tabIndex: 2})
}
//修改邮箱
exports.modifyEmail = function(req, res){
	var email = req.query.email;
	var _user = req.session.user,
	    id = _user._id;
	if(id){
		User.update({_id: id},{'$set': {email: email}}, function(err, msg){
			if(err) return err;
			_user.email = email;
			req.session.user = _user;
			res.redirect('/account/account_bind')
		})
	}else{
		res.redirect('/signin')
	}
}
//修改密码页
exports.showModifyPassword = function(req, res){
	res.render('account/account_bind', {title: '账号绑定', tabIndex: 3})
}
//修改密码
exports.modifyPassword = function(req, res){
	var _user = req.body.user,
	    password = _user.oldpasswd,
	    newPasswd = _user.newpasswd;
	var userSession = req.session.user,
			id = userSession._id,
			email = userSession.email;
	User.findOne({_id: id},function(err, user){
		if(err) console.log(err)
			if(!user){
				return res.redirect('/signin')
			}
			user.comparePassword(password, function(err, isMatch){
				if(err) console.log(err)
				if(isMatch){
					user.email = email;
					user.password = newPasswd;
					user.save(function(err, user){
						if(err) console.log(err)
						user.success = '密码修改成功！';	
						req.session.user = user;
		  			return res.render('account/account_bind', {title: '账号绑定', tabIndex: 3, user: user})
					})
				}else{
					userSession.error = '原密码不正确';
					return res.render('account/account_bind', {title: '账号绑定', tabIndex: 3, user: userSession})
				}
			})
	})
}
//找回密码
exports.showFindPassword = function(req, res){
	res.render('account/find_password',{title: '找回密码'})
}
//发送邮件提示页
exports.showSendEmail = function(req, res){
	var email = req.body.email;
	User.findOne({email: email}, function(err, user){
		if(err) return err;
		if(user){
			req.session.user = user;
			res.render('account/reset_send_email', {title: '邮件发送成功', user: user})
		}else{
			res.redirect('/signin')
		}
	})
}
//重置密码页
exports.showRestPassword = function(req, res){
	res.render('account/reset_password', {title: '重置密码'})
}
//重置密码功能
exports.resetPassword = function(req, res){
	var _user = req.body.user;
	var newpasswd = _user.newpasswd;
	var user = req.session.user;
	var id = user._id;
	User.findOne({_id: id}, function(err, user){
		if(err) console.log(err);
		if(!user){
			return redirect('/signin')
		}
		user.comparePassword(newpasswd, function(err, isMatch){
			if(err) return err;
			if(isMatch){
				user.error = '新密码不得与原密码重复';
				return res.render('account/reset_password', {title: '重置密码', user: user})
			}else{
				user.password = newpasswd;
				user.save(function(err, user){
					if(err) return err;
					return res.render('account/reset_password_success', {title: '重置密码成功'})
				})
			}
		})
	})
}
//退出功能
exports.logout = function(req, res){
 	delete req.session.user;
	res.redirect('/signin')
}
//登录验证
exports.signinRequired = function(req, res, next){
	var user = req.session.user;
	if(!user){
		return res.redirect('/signin')
	}
	next()
}
//管理员权限
exports.adminRequired = function(req, res, next){
	var user = req.session.user;
	if(user.role < 20){
		return res.redirect('/signup')
	}
}
//账户信息
exports.showAccountInfo = function(req, res){
	var user = req.session.user;
	Message.find()
				 .populate('user', 'avatar name')
				 .exec(function(err, messages){
				 		res.render('account/account_info', {title: '账户信息', messages: messages})
				 })
}
//账户信息编辑
exports.showAccountEdit = function(req, res){
	res.render('account/account_info_edit', {title: '账户信息编辑'})
}
//账户信息保存
exports.saveInfo = function(req, res){
	var userObj = req.body.user;
	userObj.idcard = Trim(userObj.idcard);
	userObj.address = Trim(userObj.address);
	userObj.signature = Trim(userObj.signature);
	var id = req.session.user._id;
	if(id){
		User.update({_id: id}, {'$set': userObj}, function(err, msg){
			if(err) return err;
			console.log(msg)
			console.log(userObj)
			console.log(req.session.user)
			var _user = _.assign(req.session.user, userObj);
			req.session.user = _user;
			console.log(_user)
		  res.redirect('/account')
		})
	}else {
		res.redirect('/signin')
	}
}
//头像上传
exports.avatarUpload = function(req, res, next){
	var user = req.session.user;
	var avatarData = req.files.avatar;
	if(avatarData && avatarData.originalFilename){
		var filePath = avatarData.path;
		fs.readFile(filePath, function(err, data){
			var timestamp = Date.now();
			var type = avatarData.name.split('.')[1];
			var avatar = 'avatar_' + timestamp + '.' +type;
			var newPath = path.join(__dirname, '../', 'public/upload/avatar/' + avatar);
			fs.writeFile(newPath, data, function(err){
				User.update({_id: user._id},{'$set': {avatar: avatar}}, function(err, msg){
					if(err) return err;
					user.avatar = avatar;
					res.redirect('/account/edit_info')
				})
			})
		})
	}else{
		next()
	}
}
//身份证正面上传
exports.idcardFrontUpload = function(req, res, next){
	var idcardData = req.files.idcard_front;
	console.log(idcardData)
	if(idcardData && idcardData.originalFilename){
		var idcardPath = idcardData.path;
		fs.readFile(idcardPath, function(err, data){
			var timestamp = Date.now();
			var type = idcardData.name.split('.')[1];
			var idcardFront = 'idcard_front_' + timestamp + '.' + type;
			var newPath = path.join(__dirname, '../', 'public/upload/idcard/' + idcardFront);
			fs.writeFile(newPath, data, function(err){
				req.idcardFront = idcardFront;
				next()
			})
		})
	}else{
		next()
	}
}
//身份证反面上传
exports.idcardBackUpload = function(req, res, next){
	var idcardData = req.files.idcard_back;
	if(idcardData && idcardData.originalFilename){
		var idcardPath = idcardData.path;
		fs.readFile(idcardPath, function(err, data){
			var timestamp = Date.now();
			var type = idcardData.name.split('.')[1];
			var idcardBack = 'idcard_back_' + timestamp + '.' + type;
			var newPath = path.join(__dirname, '../', 'public/upload/idcard/' + idcardBack);
			fs.writeFile(newPath, data, function(err){
				req.idcardBack = idcardBack;
				next()
			})
		})
	}else{
		next()
	}
}
//身份证附件保存
exports.idcardUpload = function(req, res){
	var user = req.session.user,
	    id = user._id;
	var	idcardFront = req.idcardFront || user.idcard_front;
	var	idcardBack = req.idcardBack || user.idcard_back;
	User.update({_id: user._id}, {'$set': {idcard_front: idcardFront, idcard_back: idcardBack}}, function(err, msg){
		if(err) return err;
		user.idcard_front = idcardFront;
		user.idcard_back = idcardBack;
		res.redirect('/account/edit_info');
	})
}
//账号绑定
exports.accountBind = function(req, res){
	var user = req.session.user;
	user.error = '';
	user.success = '';
	res.render('account/account_bind', {title: '账号绑定', tabIndex: 0})
}
//手机号绑定页
exports.showBindMobile = function(req, res){
	res.render('account/account_bind', {title: '账号绑定', tabIndex: 1})
}
//注册我的企业
exports.showRegisteredPartner = function(req, res){
	res.render('account/registered_partner', {title: '注册我的企业'})
}

//用户列表
exports.userlist = function(req, res){
	User.fetch(function(err, users){
		res.render('admin/userlist', {
			title: '用户列表',
			users: users
		})
	})
}
//用户删除
exports.delete = function(req, res){
	var uid = req.query.uid;
	if(uid){
		User.remove({_id: uid}, function(err, user){
			if(err) console.log(err)
			res.json({status: 1})
		})
	}
}
//用户信息编辑
exports.edit = function edit(req, res){
	var _user = req.body.user,
		  uid = _user.id,
	    name = _user.name, 
	    email = _user.email,
	 		role = _user.role;
	User.update({_id: uid}, {'$set': {name: name, email: email, role: role}}, function(err, msg){
		if(err) return err;
		res.redirect('/user/list')
	})
}
exports.conpanyIofo = function(req, res){
	res.render('company/company_info', {title: '企业信息'})
}	
exports.departdment = function(req, res){
	res.render('company/department', {title: '部门管理'})
}