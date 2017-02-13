var System = require('../models/function');
var Role = require('../models/role');
var RoleFunc = require('../models/role_func');
var Message = require('../models/message');
var Notice = require('../models/notice');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

/* 系统功能树 */
//功能树管理页
exports.showFunctionTree = function(req, res){
	res.render('system/system_function_tree', {title: '系统功能树'})
}
//新增功能节点
exports.newFunction = function(req, res){
	var user = req.session.user;
	var func = req.body.func;
	func.creator = user._id;
	console.log(func)
	var _func = new System(func);
	_func.save(function(err, func){
		if(err) {
			console.log(err)
			return res.json({status: 0})
		}
		res.json({status: 1});
	})
}
//获取功能节点树
exports.getFunctionTree = function(req, res){
	System.fetch(function(err, functions){
		if(err) console.log(err)
		res.json({functions: functions})
	})
}
//获取单个功能节点
exports.getFunctionNode = function(req, res){
	var id = req.query.id;
	System.find({_id: id})
				.populate('creator', 'name')
				.populate('updater', 'name')
				.exec(function(err, funcs){
					if(err){
						console.log(err)
						res.json({status: 0})
					}else{
						res.json({func: funcs[0]})
					}
				})
}

//编辑功能节点
exports.editFunction = function(req, res){
	var user = req.session.user;
	var func = req.body.func;
	var id = func.id;
	func.updater = user._id;
	console.log(func);
	if(!id) return res.json({status: 0})
	System.findById(id, function(err, funcitonNode){
		funcitonNode.update({$set: func}, function(err, msg){
			if(err){
				console.log(err)
				res.json({status: 2})
			}else{
				res.json({status: 1})
			}
		})
	})
}
//删除功能节点
exports.removeFunction = function(req, res){
	var id = req.query.id;
	console.log(id)
	if(id){
		System.findById(id, function(err, func){
			if(func.is_function_root == 1){
				return res.json({status: 0})
			}else{
				System.remove({_id: id}, function(err, msg){
					if(err){
						console.log(err);
						res.json({status: 2})
					}else{
						res.json({status: 1})
					}
				})
			}
		})
	}
}
//角色管理页
exports.showRoleManage = function(req, res){
	Role.find({})
			.sort('meta.createAt')
			.populate('creator', 'name')
			.exec(function(err, roles){
				if(err) console.log(err);
				res.render('system/role_manage', {title: '角色管理', roles: roles})
			})
}

//角色创建
exports.newRole = function(req, res){
	var user = req.session.user;
	var role = req.body.role;
	role.creator = user._id;
	console.log(role)
	var _role = new Role(role);
	_role.save(function(err, role){
		if(err) console.log(err);
		res.redirect('/system/role_manage')
	})
}

//角色删除
exports.removeRole = function(req, res){
	var id = req.query.id;
	if(id){
		Role.remove({_id: id}, function(err, msg){
			if(err) {
				console.log(err);
				res.json({status: 0})
			}else{
				RoleFunc.find({role: id}).exec(function(err, roleFuncs){
					if(err) console.log(err)
					roleFuncs.forEach(function(roleFunc){
						RoleFunc.remove({_id: roleFunc._id}, function(err, msg){
							if(err) console.log(err)
								res.json({status: 1})
						})
					})
				})
			}
		})
	}else{
		res.json({status: 0})
	}
}
//为角色分配功能
exports.assignFunction = function(req, res){
	var user = req.session.user;
	var roleFunc = req.body.role_func;
	var funcList = roleFunc.funcList;
	var roleId = roleFunc.roleId
	roleFunc.role = roleId;
	roleFunc.creator = user._id;
	var tempArr = [];
	var cancelFuncList = [];
	var temp = [];
	var _funcList = [];
	RoleFunc.find({role: roleId}).exec(function(err, roleFuncs){
		if(err) console.log(err)
		//获取取消选中的功能点
    for(var i = 0; i < funcList.length; i++){
    	tempArr[funcList[i]] = true;
    }
    for(var i = 0; i < roleFuncs.length; i++){
    	if(!tempArr[roleFuncs[i].func]){
    		cancelFuncList.push(roleFuncs[i].func)
    	}
    }
		//删除取消选中的功能点
		if(cancelFuncList.length !== 0){
			for(var i = 0; i < cancelFuncList.length; i++){
	    	RoleFunc.remove({role: roleId, func: cancelFuncList[i]}, function(err, msg){
	    		if(err) console.log(err)
	    	})
	    }
		}
	  //获取新添加的功能点
		for(var i = 0; i < roleFuncs.length; i++){
			temp[roleFuncs[i].func] = true;
		}
		for(var i = 0; i < funcList.length; i++){
			if(!temp[funcList[i]]){
				_funcList.push(funcList[i])
			}
		}
		//保存新添加的功能点
		if(_funcList.length !== 0) {
			var _roleFunc;
			_funcList.forEach(function(func){
				roleFunc.func = func;
		  	_roleFunc = new RoleFunc(roleFunc);
		  	_roleFunc.save(function(err, role_func){
		  		if(err) {
		  			console.log(err)
		  			return res.json({status: 0})
		  		}
		  	})
			})
		}
		res.json({status: 1})
	})
}
//获取单个角色的功能点
exports.getRoleFunc = function(req, res){
	var roleId = req.query.id;
	console.log(roleId)
	RoleFunc.find({role: roleId, status: 1})
					.populate('func', 'name parent_id')
					.exec(function(err, role_funcs){
						if(err){
							console.log(err)
						}
						res.json({role_funcs: role_funcs})
					})
}
//角色功能列表
exports.roleFuncList = function(req, res){
	RoleFunc.fetch(function(err, role_func){
		if(err) console.log(err);
		console.log(role_func)
		res.redirect('/system/role_manage')
	})
}
//公告信息管理
exports.noticeManage = function(req, res){
	Notice.find()
			  .sort('-meta.updateAt')
			  .populate('creator', 'name')
			  .populate('updater', 'name')
			  .exec(function(err, notices){
			 		res.render('system/notice_manage', {title: '公告信息维护', notices: notices})
			  })
}
//公告信息发布
exports.noticeRelease = function(req, res){
	var notice = {};
	res.render('system/notice_release', {title: '公告发布', notice: notice})
}
//公告文件上传
exports.noticeFileUpload = function(req, res, next){
	var fileData = req.files.noticeFile;
	console.log(fileData)
	if(fileData && fileData.originalFilename){
		var filePath = fileData.path;
		fs.readFile(filePath, function(err, data){
			var timestamp = Date.now();
			var type = fileData.name.split('.')[1];
			var notice_pic = 'notice_' + timestamp + '.' +type;
			var newPath = path.join(__dirname, '../', 'public/upload/notice/' + notice_pic);
			fs.writeFile(newPath, data, function(err){
				req.notice_pic = notice_pic;
				next()
			})
		})
	}else{
		next()
	}
}
//公告信息保存
exports.saveNotice = function(req, res){
	var noticeObj = req.body.notice;
	var user = req.session.user;
	if(req.notice_pic){
		noticeObj.pic = req.notice_pic;
	}
	var id = noticeObj.id;
	if(id){
		noticeObj.updater = user._id;
		Notice.findById(id, function(err, notice){
			if(err) console.log(err)
			var _notice = _.extend(notice, noticeObj)
			_notice.save(function(err, notice){
				if(err) console.log(err)
				res.redirect('/system/notice_manage')
			})
		})
	}else{
		noticeObj.creator = user._id;
		var _notice = new Notice(noticeObj);
		_notice.save(function(err, notice){
			if(err) console.log(err);
			res.redirect('/system/notice_manage')
		})
	}
}
//公告信息详情
exports.noticeDetail = function(req, res){
	var id = req.query.id;
	Notice.find({_id: id})
				.populate('creator', 'name')
				.exec(function(err, notices){
					if(err) console.log(err);
					res.render('system/notice_detail', {title: '公告详情', notice: notices[0]})
				})
}
//公告信息编辑
exports.noticeEdit = function(req, res){
	var id = req.query.id;
	Notice.findById(id, function(err, notice){
		if(err) console.log(err);
		res.render('system/notice_release', {title: '公告编辑', notice: notice})
	})
}
//公告信息删除
exports.noticeRemove = function(req, res){
	var id = req.query.id;
	if(id){
		Notice.remove({_id: id}, function(err, msg){
			if(err) console.log(err);
			res.json({status: 1})
		})
	}
}