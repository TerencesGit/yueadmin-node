const Functions = require('../models/function');
const Role = require('../models/role');
const RoleFunc = require('../models/role_func');
const PartnerType = require('../models/partner_type');
const PartTypeRole = require('../models/partType_role');
const Message = require('../models/message');
const Notice = require('../models/notice');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

/* 系统功能树 */
//功能树管理页
exports.showFunctionTree = function(req, res){
	res.render('system/function_manage', {title: '系统功能树'})
}
//新增功能节点
exports.newFunction = function(req, res){
	const user = req.session.user;
	const func = req.body.func;
	func.creator = user._id;
	console.log(func)
	const _func = new Functions(func);
	_func.save(function(err, func){
		if(err) {
			console.log(err)
			res.json({status: 0})
		}
		res.json({status: 1});
	})
}
//获取功能节点树
exports.getFunctionTree = function(req, res){
	const _functions = [];
	var _func;
	Functions.fetch(function(err, functions){
		if(err) console.log(err)
			functions.forEach(function(func){
				_func = {
					funcId: func._id,
					parentId: func.parent_id,
          name: func.name,
          viewname: func.viewname,
          funcMd5: func.code,
          funcIco: func.ico,
          funcUrl: func.router,
          funcDesc: func.desc,
          funcLevel: func.level,
          funcSeq: func.seq,
          funcType: func.type,
          status: func.status,
          updateTime: func.meta.updateAt,
				}
				_functions.push(_func)
			})
		res.json({functions: _functions})
	})
}
//获取单个功能节点
exports.getFunctionNode = function(req, res){
	const id = req.query.id;
	var _func;
	Functions.findOne({_id: id})
					 .populate('creator', 'name')
					 .populate('updater', 'name')
					 .exec(function(err, func){
						if(err){
							console.log(err)
							res.json({status: 0})
						}else{
							_func = {
								funcId: func._id,
								parentId: func.parent_id,
			          name: func.name,
			          viewname: func.viewname,
			          funcMd5: func.code,
			          funcIco: func.ico,
			          funcUrl: func.router,
			          funcDesc: func.desc,
			          funcLevel: func.level,
			          funcSeq: func.seq,
			          funcType: func.type,
			          status: func.status,
			          createTime: func.meta.createAt,
							}
							res.json({func: _func})
						}
					})
}

//编辑功能节点
exports.editFunction = function(req, res){
	const user = req.session.user;
	const func = req.body.func;
	const id = func.id;
	func.updater = user._id;
	var _func;
	if(!id) return res.json({status: 0})
	console.log(func)
	Functions.findById(id, function(err, funcObj){
		_func = _.extend(funcObj, func);
		_func.save(function(err, func){
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
		Functions.findById(id, function(err, func){
			if(func.is_function_root == 1){
				return res.json({status: 0})
			}else{
				Functions.remove({_id: id}, function(err, msg){
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
	var funcs = [];
  var funcObj = {};
	RoleFunc.find({role: roleId, status: 1})
					.populate('func', 'name parent_id')
					.exec(function(err, role_funcs){
						if(err){
							console.log(err)
						}
						role_funcs.forEach(function(roleFunc){
							funcObj = {
								funcId: roleFunc.func._id,
								parentId: roleFunc.func.parent_id,
								name: roleFunc.func.name,
							}
							funcs.push(funcObj)
						})
						console.log(funcs)
						res.json({funcs: funcs})
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
//商家类型管理
exports.partnerTypeManage = function(req, res){
	PartnerType.find({})
			.sort('meta.createAt')
			.populate('creator', 'name')
			.exec(function(err, partnerTypes){
				if(err) console.log(err);
				Role.fetch(function(err, roles){
					res.render('system/partner_type_manage', {
						title: '商家类型管理', 
						partnerTypes: partnerTypes,
						roles: roles
					})
				})
			})
}
//保存商家类型
exports.savePartnerType = function(req, res){
	const user = req.session.user;
	const partnerType = req.body.partner_type;
	const id = partnerType.id;
	var _partType;
	if(id){
		partnerType.updater = user._id;
		PartnerType.findById(id, function(err, partType){
			_partType = _.extend(partType, partnerType);
			_partType.save(function(err, msg){
				if(err) {
					console.log(err)
					res.json({status: 0})
				}else{
					res.json({status: 1})
				}
			})
		})
	}else{
		partnerType.creator = user._id;
		var partType = new PartnerType(partnerType);
		console.log(partType)
		partType.save(function(err, partType){
			if(err) {
				console.log(err)
				res.json({status: 0})
			}else{
				res.json({status: 1})
			}
		})
	}
}
//设置商家类型权限
exports.setPartTypeRole = function(req, res){
	const user = req.session.user;
	const partTypeRole = req.body.typeRole,
				typeId = partTypeRole.partType,
				roleList = partTypeRole.roleList;
	var typeRole = {
		creator: user._id,
		partType: typeId,
	};
	var _typeRole;
	roleList.forEach(function(role){
		typeRole.role = role;
		_typeRole = new PartTypeRole(typeRole);
		console.log(_typeRole)
		_typeRole.save(function(err, partrole){
			if(err) {
				console.log(err)
				res.json({status: 0})
			}
		})
	})
	res.json({status: 1})
}
//获取商家类型拥有的权限
exports.getRoleByPartType = function(req, res){
	const typeId = req.body.id;
	console.log(typeId)
	var roleObj;
	var roles = [];
	PartTypeRole.find({partType: typeId})
							.populate('role', 'name')
							.exec(function(err, partRoles){
								if(err) console.log(err)
									console.log(partRoles)
								partRoles.forEach(function(partRole){
									roleObj = {
										id: partRole.role._id,
										name: partRole.role.name
									}
									roles.push(roleObj)
								})
								console.log(roles)
								res.json({roles: roles})
							})
}
//商家类型状态设置
exports.setPartnerTypeStatus = function(req, res){
	const id = req.body.id;
	const status = parseInt(req.body.statu) ? 0 : 1;
	if(id){
		PartnerType.update({_id: id}, {$set: {status: status}}, function(err, msg){
			if(err){
				console.log(err)
				res.json({status: 0})
			}else{
				res.json({status: 1})
			}
		})
	}
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
//账户列表
exports.accountManage = function(req, res){
	// var page = {
	// 	number: req.query.page || 1,
	// 	limit: 5
	// }
	// var search = req.query.search || {};
	// if(req.query.page){
	// 	page.number = req.query.page < 1 ? 1 : req.query.page;
	// }
	// var model = {
	// 	page: page,
	//   search: search
	// }
	User.find({})
			.populate('partner', 'name')
			.populate('organize', 'name')
			.exec(function(err, users){
				res.render('system/account_manage', {
					title: '用户列表',
					users: users,
				})
			}) 
	// User.findByPagination(model, function(err, pageIndex, pageCount, users){
	// 	res.render('system/account_manage', {
	// 			title: '用户列表',
	// 			users: users,
	// 			pageCount: pageCount,
	// 			pageIndex: pageIndex
	// 		})
	// })
}
//查看账户信息
exports.showAccountInfo = function(req, res){
	const id = req.query.id;
	User.findOne({_id: id})
			.populate('partner', 'name')
			.populate('organize', 'name')
			.exec(function(err, account){
				res.render('system/account_info', {title: '账户信息', account: account})
			})
}
//设置账户状态
exports.setAccountStatus = function(req, res){
	const id = req.query.id,
				status = req.query.status;
	if(id){
		User.update({_id: id}, {$set: {status: status}}, function(err, msg){
			if(err) console.log(err)
				res.json({status: 1})
		})
	}
}
//删除账户
exports.removeAccount = function(req, res){
	var id = req.query.id;
	if(id){
		User.remove({_id: id}, function(err, msg){
			if(err) console.log(err)
				res.json({status: 1})
		})
	}else{
		res.json({status: 0})
	}
}