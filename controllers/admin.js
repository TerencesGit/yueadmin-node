var Partner = require('../models/partner');
var User = require('../models/user');
var Organize = require('../models/organize');
var Role = require('../models/role');
var OrgRole = require('../models/org_role');
var RoleFunc = require('../models/role_func');
var Title = require('../models/title');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

//商家列表 条件查询加分页
exports.managePartner = function(req, res){
	var search = req.query.search || {};
	switch(search){
		case '0':
			search = {is_verified: 0}
			break;
		case '1':
			search = {is_verified: 1}
			break;
		case '2':
			search = {is_verified: 2}
			break;
		case '3':
			search = {is_verified: 3}
			break;
		default :
			search = {}
			break;
	}
	var pageIndex = req.query.page || 1;
	if(req.query.page){
		pageIndex = req.query.page < 1 ? 1 : req.query.page;
	}
	var pageSize = 5;
	var skipFrom = (pageIndex * pageSize) - pageSize;
	Partner.find(search)
				 .sort('-meta.updateAt')
				 .limit(pageSize)
				 .skip(skipFrom)
				 .populate('admin', 'name')
				 .exec(function(err, partners){
				 	if(err){
				 		console.log(err)
				 	}else{
				 		Partner.count(search, function(err, count){
				 			if(err){
				 				console.log(err)
				 			}else{
				 				var pageCount = Math.ceil(count / pageSize)
				 				res.render('admin/partner_manage', {
									title: '商家列表',
									partners: partners,
									pageCount: pageCount,
									pageIndex: pageIndex,
									status: search.is_verified
							})
				 			}
				 		})
				 	}
				 })
}
//商家审核
exports.verifiedPartner = function(req, res){
	var id = req.query.id;
	Partner.findOne({_id: id}, function(err, partner){
		if(err) console.log(err);
		res.render('admin/verified_partner',{title: '商家审核', partner: partner})
	})
}
//商家信息审核通过
exports.verifiedPass = function(req, res){
	var id = req.query.id;
	var _organize = {};
	if(id){
		Partner.findById(id, function(err, partner){
			_organize.partner = id;
			_organize.admin = partner.admin;
			_organize.name = partner.name;
			_organize.is_partner_root = 1;
			var organize = new Organize(_organize);
			organize.save(function(err, organize){
				if(err){
					console.log(err)
				}else{
					Partner.update({_id: id}, {$set: {is_verified: 1}}, function(err, msg){
						res.redirect('/admin/manage_partner')
					})
				}
			})
		})
	}else{
		res.redirect('/')
	}
}
//商家信息审核不通过 
exports.verifiedNoPass = function(req, res){
	var partner = req.body.partner;
	var id = partner.id,
	    info = Trim(partner.reject_info);
	if(partner){
		Partner.update({_id: id}, {$set: {is_verified: 2, reject_info: info}}, function(err, msg){
			if(err) console.log(err)
			res.redirect('/admin/manage_partner')
		})
	}else{
		res.redirect('/')
	}    
}

//合同列表
exports.contractManage = function(req, res){
	res.render('admin/contract_manage', {title: '合同管理'})
}
//创建合同模板页
exports.newContractTemplate = function(req, res){
	var template = {}
	res.render('admin/contract_template', {title: '创建合同模板', template: template})
}
//添加合同 
exports.newContract = function(req, res){
	var contract = {}
	res.render('admin/contract_input', {title: '合同添加', contract: contract})
}