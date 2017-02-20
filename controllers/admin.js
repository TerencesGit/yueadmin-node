var User = require('../models/user');
var Partner = require('../models/partner');
var Organize = require('../models/organize');
var Template = require('../models/contract_template');
var Contract = require('../models/contract');
var Role = require('../models/role');
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

//合同模板管理
exports.contractTemplateManage = function(req, res){
	Template.find({})
					.populate('creator', 'name')
					.exec(function(err, templates){
						res.render('admin/contract_template_manage', {
							title: '合同模板管理', 
							templates: templates
						})
					})
	
}
//新增合同模板
exports.newContractTemplate = function(req, res){
	var template = {}
	res.render('admin/contract_template', {title: '创建合同模板', template: template})
}
//保存合同模板文件
exports.saveTemplateFile = function(req, res, next){
	var templateData = req.files.contract_file;
	console.log(templateData)
	if(templateData && templateData.originalFilename){
		var templatePath = templateData.path;
		fs.readFile(templatePath, function(err, data){
			var timestamp = Date.now();
			var type = templateData.name.split('.')[1];
			var template = 'contract_' + timestamp + '.' + type;
			var newPath = path.join(__dirname, '../', 'public/upload/contract/' + template);
			fs.writeFile(newPath, data, function(err){
				req.template = template;
				next()
			})
		})
	}else{
		next()
	}
}
//保存合同模板
exports.saveTemplate = function(req, res){
	var user = req.session.user;
	var template = req.body.template;
	if(req.template){
		template.file = req.template;
	}
	var id = template.id;
	if(id){
		template.updater = user._id;
		Template.findById(id, function(err, originalTemplate){
			var _template = _.extend(originalTemplate, template);
			_template.save(function(err, template){
				if(err) console.log(err)
				res.redirect('/admin/contract_template_manage')
			})
		})
	}else{
		template.creator = user._id;
		var _template = new Template(template);
		_template.save(function(err, template){
			if(err) console.log(err)
			res.redirect('/admin/contract_template_manage')
		})
	}
}
//合同模板编辑
exports.editTemplate = function(req, res){
	var id = req.query.id;
	Template.findById(id, function(err, template){
		if(err) console.log(err)
		res.render('admin/contract_template_edit', {title: '合同模板编辑', template: template})
	})
}
//合同模板删除
exports.removeTemplate = function(req, res){
	var id = req.query.id;
	if(id){
		Template.remove({_id: id}, function(err, msg){
			if(err) console.log(err)
			res.redirect('/admin/contract_template_manage')
		})
	}
}

//合同管理
exports.contractManage = function(req, res){
	Contract.find({})
					.populate('creator', 'name')
					.populate('template', 'name')
					.exec(function(err, contracts){
						res.render('admin/contract_manage', {title: '合同管理', contracts: contracts})
					})
}
//添加合同 
exports.newContract = function(req, res){
	var contract = {}
	Template.fetch(function(err, templates){
		if(err) console.log(err)
		res.render('admin/contract_input', {
			title: '合同添加', 
			contract: contract,
			templates: templates
		})
	})
}
//合同附件上传
exports.attachUpload1 = function(req, res, next){
	var attachData = req.files.attach_file_1;
	console.log(attachData)
	if(attachData && attachData.originalFilename){
		var attachPath = attachData.path;
		fs.readFile(attachPath, function(err, data){
			var timestamp = Date.now();
			var type = attachData.name.split('.')[1];
			var attach = 'attach_' + timestamp + '.' + type;
			var newPath = path.join(__dirname, '../', 'public/upload/attach/' + attach);
			fs.writeFile(newPath, data, function(err){
				req.attach_1 = attach;
				next()
			})
		})
	}else{
		next()
	}
}
//保存合同
exports.saveContract = function(req, res){
	var user = req.session.user;
	var contract = req.body.contract;
	if(req.attach_1){
		contract.attach_file_1 = req.attach_1;
	}
	console.log(contract)
	var id = contract.id;
	var _contract;
	if(id){
		contract.updater = user._id;
		Contract.findById(id, function(err, contractObj){
			_contract = _.extend(contractObj, contract)
			_contract.save(function(err, contract){
				if(err) console.log(err)
					res.redirect('/admin/contract_manage');
			})
		})
	}else{
		contract.creator = user._id;
		_contract = new Contract(contract);
		_contract.save(function(err, contract){
			if(err){
				console.log(err)
			}else{
				res.redirect('/admin/contract_manage');
			}
		})
	}
}
//合同编辑
exports.editContract = function(req, res){
	var id = req.query.id;
	if(id){
		Contract.findById(id, function(err, contract){
			if(err) console.log(err)
			Template.fetch(function(err, templates){
				if(err) console.log(err)
				res.render('admin/contract_input', {
					title: '合同编辑', 
					contract: contract,
					templates: templates
				})
			})
		})
	}
}
//合同删除
exports.removeContract = function(req, res){
	 var id = req.query.id;
	 if(id){
	 	Contract.remove({_id: id}, function(err, msg){
	 		if(err) console.log(err)
	 			res.redirect('/admin/contract_manage');
 	 	})
	 }
}
//权限管理
exports.jurisdictionManage = function(req, res){
	Partner.fetch(function(err, partners){
		if(err) console.log(err)
		Role.fetch(function(err, roles){
			if(err) console.log(err)
			res.render('admin/jurisdiction_manage',{
				title: '权限管理', 
				partners: partners,
				roles: roles
			})
		})
	})
}
//企业详情
exports.showPartnerInfo = function(req, res){
	var id = req.query.id;
	Partner.findById(id, function(err, partner){
		res.render('admin/partner_info', {title: '企业信息', partner: partner})
	})
}
//设置企业状态
exports.setPartnerStatus = function(req, res){
	var pid = req.query.pid;
	var stid = req.query.stid;
	console.log(pid)
	console.log(stid)
	if(pid){
		Partner.update({_id: pid}, {$set: {status: stid}}, function(err, msg){
			if(err) console.log(err)
				res.json({status: 1})
		})
	}else{ 
		res.json({status: 0})
	}
}