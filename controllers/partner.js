var Partner = require('../models/partner');
var User = require('../models/user');
var Organize = require('../models/organize');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

//去除前后空格
function Trim(str){ 
  return str.replace(/(^\s*)|(\s*$)/g, ''); 
}
//企业LOGO上传
exports.logoUpload = function(req, res, next){
	var logoData = req.files.logo;
	console.log(logoData)
	if(logoData && logoData.originalFilename){
		var logoPath = logoData.path;
		fs.readFile(logoPath, function(err, data){
			var timestamp = Date.now();
			var type = logoData.name.split('.')[1];
			var logo = 'logo_' + timestamp + '.' + type;
			var newPath = path.join(__dirname, '../', 'public/upload/logo/' + logo);
			fs.writeFile(newPath, data, function(err){
				req.logo = logo;
				next()
			})
		})
	}else{
		next()
	}
}
//营业执照上传
exports.licenseUpload = function(req, res, next){
	var licenseData = req.files.license;
	console.log(licenseData)
	if(licenseData && licenseData.originalFilename){
		var licensePath = licenseData.path;
		fs.readFile(licensePath, function(err, data){
			var timestamp = Date.now();
			var type = licenseData.name.split('.')[1];
			var license = 'license_' + timestamp + '.' + type;
			var newPath = path.join(__dirname, '../', 'public/upload/license/' + license);
			fs.writeFile(newPath, data, function(err){
				req.license = license;
				next()
			})
		})
	}else{
		next()
	}
}
//企业信息保存
exports.saveInfo = function(req, res){
	var user = req.session.user;
	var partnerObj = req.body.partner;
	var id= partnerObj._id;
	var _partner;
	if(req.logo){
		partnerObj.logo = req.logo;
	}
	if(req.license){
		partnerObj.license = req.license;
	}
	if(id !== 'undefined'){
		Partner.findById(id, function(err, partner){
			if(err) console.log(err);
			_partner = _.extend(partner, partnerObj);
			_partner.is_verified = 3;
			_partner.save(function(err, partner){
				if(err) console.log(err);
				console.log('提交注册成功again')
				res.render('account/registered_partner_success',{title: '修改提交成功'})
			})
		})
	}else{
		partnerObj.admin = user._id;
		Partner.findOne({admin: _partner.admin}, function(err, partner){
			if(err) return err;
			if(!partner){
				var partner = new Partner(_partner);
				partner.save(function(err, partner){
					console.log('提交注册成功')
					console.log(partner)
					User.update({_id: user._id},{$set: {partner: partner._id}}, function(err, msg){
						user.partner = partner._id;
						res.render('account/registered_partner_success',{title: '提交注册成功'})
					})
				})
			}else{
				console.log('该账号已经注册，不能重复注册！')
				res.redirect('/account/registered_partner')
			}
		})
	}
}
//企业信息展示
exports.showInfo = function(req, res){
	var user = req.session.user;
	if(user.partner){
		Partner.find({admin: user._id})
				 .populate('user', 'name')
				 .exec(function(err, partner){
				 		if(partner[0].is_verified !== 1){
				 			res.redirect('/account/registered_partner')
				 		}else{
				 			res.render('partner/partner_info',{title: '企业信息', partner: partner[0]})
				 		}
				 })
	}else{
		res.redirect('/account/registered_partner')
	}
}
//企业信息编辑
exports.EditInfo = function(req, res){
	var _partner = req.body.partner;
	var id = _partner.id;
	Partner.findOne({_id: id}, function(err, partner){
		_partner.logo = req.logo || partner.logo;
		_partner.license = req.license || partner.license;
		Partner.update({_id: id}, {$set: _partner }, function(err, msg){
			if(err) console.log(err);
			res.redirect('/partner/partner_info')
		})
	})
}
//组织部门管理
exports.departdment = function(req, res){
	var user = req.session.user;
	var id = user._id;
	Partner.findOne({admin: user._id}, function(err, partner){
		if(!partner){
			return res.render('account/registered_partner', {title: '注册我的企业'})
		}
		if(partner.is_verified == 0 || partner.is_verified == 3){
			res.render('account/registered_partner_success',{title: '等待审核'})
		}else if(partner.is_verified == 2){
			res.render('account/registered_partner_result',{title: '未通过审核', partner: partner})
		}else{
			Organize.find({partner: partner._id}).exec(function(err, organizes){
				res.render('partner/department_manage', {
					title: '部门管理', 
					partner: partner,
					organizes: organizes
				})
			})
		}
	})
}
//获取部门组织树
exports.getDepartmentTree = function(req, res){
	var partnerId = req.query.partnerId;
	var userId = req.session.user._id;
	Organize.find({partner: partnerId}).exec(function(err, organizes){
		User.find({_id: userId}, function(err, users){
			if(err) console.log(err)
			res.json({organizes: organizes, users: users})
		})
	})
}
//创建修改组织部门
exports.newOrganize = function(req, res){
	var user = req.session.user;
	if(!user){
		return res.redirect('/signin')
	}
	var organzieObj = req.body.organize;
	console.log(organzieObj)
	var id = organzieObj.id;
	var _organize;
	if(id !== ''){
		Organize.findById(id, function(err, organize){
			_organize = _.extend(organize, organzieObj);
			_organize.save(function(err, organize){
				if(err) console.log(err)
				res.redirect('/partner/department_manage')
			})
		})
	}else{
		var uid = user._id;
		var partnerId = user.partner;
		organzieObj.admin = uid;
		organzieObj.creator = uid;
		organzieObj.partner = partnerId;
		organzieObj.parent_id = organzieObj.parentId;
		var organize = new Organize(organzieObj);
		organize.save(function(err, organize){
			if(err) console.log(err)
			res.redirect('/partner/department_manage')
		})
	}
}
//删除组织部门
exports.removeOrganize = function(req, res){
	var id = req.query.id;
	if(id){
		Organize.find({parent_id: id}).exec(function(err, organizes){
			if(!organizes[0]){
				Organize.remove({_id: id}, function(err, msg){
					if(err) console.log(err)
					res.json({status: 1})
				})
			}else{
				res.json({status: 2})
			}
		})
	}else{
		res.json({status: 0})
	}
}
//员工管理
exports.staffList = function(req, res){
	var user = req.session.user;
	var partnerId = user.partner;
	User.find({partner: partnerId})
			.populate('partner', 'name')
			.populate('organize', 'name')
			.exec(function(err, users){
			  if(err) console.log(err)
			  	console.log(users[0])
			  res.render('partner/staff_manage',{title: '员工管理', users: users})
			})
}
//账户代注册
exports.agentRegister = function(req, res){
	res.render('partner/agent_register', {title: '账户代注册'})
}

/* 管理员操作 */

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
				 .sort('-meta.createAt')
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
				 				res.render('admin/partner_list', {
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
