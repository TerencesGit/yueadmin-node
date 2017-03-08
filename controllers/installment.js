const Partner = require('../models/partner');
const User = require('../models/user');
const Role = require('../models/role');
const Organize = require('../models/organize');
const _ = require('lodash');

/** 平台管理 **/
//登录页
exports.signin = function(req, res){
  res.render('installmetn/signin', {title: '欢迎登录'})
}
//分期贷款首页 商家管理
exports.home = function(req, res){
	Partner.fetch(function(err, partners){
		if(err) console.log(err)
		Role.fetch(function(err, roles){
			if(err) console.log(err)
			res.render('installment/admin/merchant_manage',{
				title: '商户管理', 
				partners: partners,
				roles: roles
			})
		})
	})
}
//商户代注册页
exports.showMerchantRegistration = function(req, res){
	res.render('installment/admin/merchant_registration', {title: '商户代注册'})
}
//商户代注册
exports.merchantRegistration = function(req, res){
	const merchant = req.body.merchant;
	console.log(merchant)
}
//金服协议管理
exports.financialService = function(req, res){
	res.render('installment/admin/financial_service', {title: '金服协议管理'})
}
//商家信息查看
exports.merchantInfo = function(req, res){
	res.render('installment/admin/merchant_info', {title: '商家信息'})
}
//C端用户管理
exports.accountManage = function(req, res){
	User.find({})
			.populate('partner', 'name')
			.populate('organize', 'name')
			.exec(function(err, users){
				res.render('installment/admin/account_manage', {
					title: 'C端用户管理',
					users: users,
				})
			}) 
}
//用户信息查看
exports.accountInfo = function(req, res){
	res.render('installment/admin/account_info', {title: '用户信息'})
}
//金融机构管理
exports.financialManage = function(req, res){
	res.render('installment/admin/financial_institutions_manage', {title: '金融机构管理'})
}
//分期贷管理
exports.installmentlManage = function(req, res){
	res.render('installment/admin/installment_manage', {title: '分期贷管理'})
}
/** 用户操作 **/
//登录页
exports.signin = function(req, res){
	res.render('installment/signin', {title: '用户登录'})
}
//分期贷查看
exports.myInsatllment = function(req, res){
	res.render('installment/user/installment_manage', {title: '我的分期贷'})
}
//金服合同查看
exports.financialContract = function(req, res){
	res.render('installment/user/financial_service', {title: '金融协议查看'})
}