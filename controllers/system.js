var System = require('../models/function');

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