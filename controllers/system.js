var System = require('../models/function');
var Role = require('../models/role');
var RoleFunc = require('../models/role_func');

/* 系统功能树 */

//功能树管理页
exports.showFunctionTree = function(req, res){
	res.render('system/system_function_tree', {title: '系统功能树'})
}

//公告信息发布页
exports.noticeManage = function(req, res){
	res.render('system/notice_manage', {title: '公告信息维护'})
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
	RoleFunc.find({role: roleId, status: 1}).exec(function(err, role_funcs){
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