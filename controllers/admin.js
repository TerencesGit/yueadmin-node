const User = require('../models/user');
const Partner = require('../models/partner');
const Organize = require('../models/organize');
const Template = require('../models/contract_template');
const Contract = require('../models/contract');
const Role = require('../models/role');
const PartRole = require('../models/part_role');
const PartType = require('../models/partner_type');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
//去除前后空格
function Trim(str){ 
  return str.replace(/(^\s*)|(\s*$)/g, ''); 
}
//获取数组a与数组b不重复的部分
function getANotB(a, b){
	var temp = [];
	var arr = [];
	for(var i = 0; i < b.length; i++){
		temp[b[i]] = true;
	}
 for(var j = 0; j < a.length; j++){
 	if(!temp[a[j]]){
 		arr.push(a[j])
 	}
 }
 return arr;
}
//商家列表 条件查询加分页
exports.partnerExamine = function(req, res){
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
	var pageSize = 10;
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
				 				res.render('admin/partner_examine', {
									title: '商家审核',
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
exports.examiningPartner = function(req, res){
	const id = req.query.partner_id;
	Partner.findOne({_id: id}, function(err, partner){
		if(err) console.log(err);
		PartType.fetch(function(err, partTypes){
			if(err) console.log(err)
			res.render('admin/examining_partner',{
				title: '商家审核', 
				partner: partner,
				partTypes: partTypes
			})
		})
	})
}
//商家信息审核通过
exports.partnerExamThrough = function(req, res){
	const partner = req.body.partner,
				id = partner.id,
				part_type = partner.type;
	console.log(partner)
	var _organize = {};
	if(id){
		Partner.findById(id, function(err, partner){
			Organize.findOne({partner: id}).exec(function(err, org){
				if(org){
					Partner.update({_id: id}, {$set: {is_verified: 1, partner_type: part_type}}, function(err, msg){
						return res.redirect('/admin/partner_examine')
					})
				}else{
					_organize.partner = id;
					_organize.admin = partner.admin;
					_organize.name = partner.name;
					_organize.is_partner_root = 1;
					var organize = new Organize(_organize);
					organize.save(function(err, organize){
						if(err){
							console.log(err)
						}else{
							Partner.update({_id: id}, {$set: {is_verified: 1, partner_type: part_type}}, function(err, msg){
								res.redirect('/admin/partner_examine')
							})
						}
					})
				}
			})
		})
	}else{
		res.redirect('/')
	}
}
//商家信息审核不通过 
exports.partnerExamReject = function(req, res){
	var partner = req.body.partner;
	var id = partner.id,
	    info = Trim(partner.reject_info);
	if(partner){
		Partner.update({_id: id}, {$set: {is_verified: 2, reject_info: info}}, function(err, msg){
			if(err) console.log(err)
			res.redirect('/admin/partner_examine')
		})
	}else{
		res.redirect('/')
	}    
}

//商家管理
exports.partnerManage = function(req, res){
	Partner.find({})
				 .sort('-meta.createAt')
				 .populate('admin', 'name')
				 .populate('partner_type', 'name')
				 .populate('managed_by_org', 'name')
				 .exec(function(err, partners){
				 	if(err) console.log(err)
					Role.fetch(function(err, roles){
						if(err) console.log(err)
						res.render('admin/partner_manage',{
							title: '商家管理', 
							partners: partners,
							roles: roles
						})
					})
				 })
}
//企业信息查看
exports.showPartnerInfo = function(req, res){
	const partnerId = req.query.id;
	if(partnerId){
		Partner.findOne({_id: partnerId})
					 .populate('admin', 'name')
					 .exec(function(err, partner){
					 	 res.render('admin/show_partner_info', {
					 	 	title: '企业信息查看', 
					 	 	partner: partner
					 	 })
					 })
	}
}
//企业管理员信息查看
exports.showAdminInfo = function(req, res){
	const id = req.query.id;
	User.findOne({_id: id})
			.populate('partner', 'name')
			.populate('organize', 'name')
			.exec(function(err, admin){
				res.render('admin/show_admin_info', {title: '管理员信息', account: admin})
			})
}
//设置企业所属主管部门
exports.setPartManagedByOrg = function(req, res){
	const partnerId = req.body.partnerId;
	const orgId = req.body.orgId;
	if(partnerId && orgId){
		Partner.update({_id: partnerId}, {$set: {managed_by_org: orgId}}, function(err, msg){
			if(err) console.log(err)
				res.json({status: 1})
		})
	}else{
		res.json({status: 0})
	}
}
//企业合同设置
exports.setPartnerContract = function(req, res){
	const pid = req.query.id;
	var _partner;
	Partner.findById(pid, function(err, partner){
		if(partner){
			_partner = partner;
		}else{
			return res.render('500', {title: '服务器错误'})
		}
	})
	Contract.find({partner_id: ''})
					.populate('creator', 'name')
					.populate('template', 'name')
					.exec(function(err, notBindContracts){
						Contract.find({partner_id: pid})
										.populate('creator', 'name')
										.populate('template', 'name')
										.exec(function(err, bindContracts){
											res.render('admin/set_partner_contract', {
													title: '企业合同设置', 
													partner: _partner,
													bindContracts: bindContracts,
													notBindContracts: notBindContracts
											})
										})						
					})
}
//合同绑定
exports.bindContract = function(req, res){
	const pid = req.query.partner_id,
				cid = req.query.contract_id;
	if(pid && cid){
		Contract.update({_id: cid}, {$set: {partner_id: pid}}, function(err, msg){
			if(err) console.log(err)
				res.redirect('/admin/set_partner_contract?id='+pid+'')
		})
	}else{
		res.redirect('/admin/set_partner_contract?id='+pid+'')
	}
}
//合同解绑
exports.unBindContract = function(req, res){
	const cid = req.query.contract_id,
				pid = req.query.partner_id;
	if(cid){
		Contract.update({_id: cid}, {$set: {partner_id: ''}}, function(err, msg){
			if(err) console.log(err)
			res.redirect('/admin/set_partner_contract?id='+pid+'')
		})
	}else{
		res.redirect('/admin/set_partner_contract?id='+pid+'')
	}
}
//设置企业权限
exports.setPartnerRole = function(req, res){
	const partRole = req.body.part_role;
	//企业Id
	const partId = partRole.part_id;
	//权限列表
	const roleList = partRole.role_list;
	const partRoleObj = {
		partner: partId,
	};
	var _partRole;
	PartRole.find({partner: partId}, function(err, partRoles){
		//获取原有权限列表
		const getRoleId = partRole => partRole.role;
		const originalRoleList = partRoles.map(getRoleId);
		//获取新增权限列表
		const newRoleList = getANotB(roleList, originalRoleList);
		//保存新增权限列表
		if(newRoleList.length !== 0){
			newRoleList.forEach(function(role){
				partRoleObj.role = role;
				console.log(partRoleObj)
				_partRole = new PartRole(partRoleObj);
				_partRole.save(function(err, partrole){
					if(err) console.log(err)
				})
			})
		}
		//获取被移除权限列表
		const removeRoleList = getANotB(originalRoleList, roleList);
		//删除被移除的权限列表
		if(removeRoleList.length !== 0){
			removeRoleList.forEach(function(role){
				PartRole.remove({partner: partId, role: role}, function(err, msg){
					if(err) console.log(err)
				})
			})
		}
		res.json({status: 1})
	})
}
//获取企业权限列表
exports.getRoleByPartner = function(req, res){
	const partId = req.query.id;
	PartRole.find({partner: partId}, function(err, partRoles){
		if(err){
			console.log(err)
		}else{
			res.json({partRoles: partRoles})
		}
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
//合同模板下载
exports.downloadTemplate = function(req, res){
	const filename = req.query.name;
	const filepath = 'D:/YueAdmin/public/upload/contract/'+filename;
	res.download(filepath, filename);
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
						res.render('admin/contract_manage', {
							title: '合同管理', 
							contracts: contracts
						})
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
		contract.partner_id = '';
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
//合同查看
exports.showContract = function(req, res){
	const id = req.query.id;
	Contract.findOne({_id: id})
					.populate('creator', 'name')
					.populate('updater', 'name')
					.populate('template', 'name')
					.exec(function(err, contract){
						if(err) console.log(err)
							console.log(contract)
						res.render('admin/contract_detail', {title: '合同查看', contract: contract})
					})
}
//合同编辑
exports.editContract = function(req, res){
	var id = req.query.id;
	if(id){
		Contract.findById(id, function(err, contract){
			if(err) console.log(err)
			Template.fetch(function(err, templates){
				if(err) console.log(err)
					console.log(contract)
					console.log(templates)
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