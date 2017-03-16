const User = require('../models/user');
const Partner = require('../models/partner');
const Organize = require('../models/organize');
const Template = require('../models/contract_template');
const Contract = require('../models/contract');
const Role = require('../models/role');
const PartRole = require('../models/part_role');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

//账户首页
exports.home = function(req, res){
	res.render('payment/account_home', {title: '账户首页'})
}
//修改密码
exports.modifyPassword = function(req, res){
	res.render('payment/modify_password', {title: '修改密码'})
}
//重置密码
exports.resetPassword = function(req, res){
	res.render('payment/reset_password', {title: '重置密码'})
}
//重置密码成功
exports.resetPasswordSuccess = function(req, res){
	res.render('payment/reset_password_success', {title: '重置密码成功'})
}
//银行卡管理
exports.bankCardManage = function(req, res){
	res.render('payment/bank_card_manage', {title: '银行卡管理'})
}
//添加银行卡
exports.addBankCard = function(req, res){
	res.render('payment/add_bank_card', {title: '添加银行卡'})
}
//银行卡详情
exports.bankCardDetail = function(req, res){
	res.render('payment/bank_card_detail', {title: '银行卡详情'})
}
//收货地址管理
exports.deliveryAddressManage = function(req, res){
	res.render('payment/delivery_address_manage', {title: '收货地址管理'})
}
//添加收货地址
exports.addDeliveryAddress = function(req, res){
	res.render('payment/add_delivery_address', {title: '添加收货地址'})
}