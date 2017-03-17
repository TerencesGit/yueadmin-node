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
//设置身份信息
exports.setIdentityInfo = function(req, res){
	res.render('payment/set_identity_info', {title: '设置身份信息'})
}
//设置支付方式
exports.setPaymentMethod = function(req, res){
	res.render('payment/set_payment_method', {title: '设置支付方式'})
}
//注册成功
exports.registerSuccess = function(req, res){
	res.render('payment/register_success', {title: '注册成功'})
}
//认证信息
exports.showAuthentication = function(req, res){
	res.render('payment/authentication', {title: '认证信息'})
}
//找回密码
exports.findPassword = function(req, res){
	res.render('payment/find_password', {title: '找回密码'})
}
//重置密码
exports.resetPassword = function(req, res){
	res.render('payment/reset_password', {title: '重置密码'})
}
//重置密码成功
exports.resetPasswordSuccess = function(req, res){
	res.render('payment/reset_password_success', {title: '重置密码成功'})
}
//修改密码
exports.modifyPassword = function(req, res){
	res.render('payment/modify_password', {title: '修改密码'})
}
//重新设置密码
exports.modifyPasswordSetting = function(req, res){
	res.render('payment/modify_password_setting', {title: '重新设置密码'})
}
//修改密码成功
exports.modifyPasswordSuccess = function(req, res){
	res.render('payment/modify_password_success', {title: '修改密码成功'})
}
//修改手机号
exports.modifyCellphone = function(req, res){
	res.render('payment/modify_cellphone', {title: '修改手机号'})
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
//账户充值
exports.accountRecharge = function(req, res){
	res.render('payment/account_recharge', {title: '账户充值'})
}
//账户充值确认
exports.accountRechargeConfirm = function(req, res){
	res.render('payment/account_recharge_confirm', {title: '账户充值确认'})
}
//余额提现
exports.balanceWithdrawals = function(req, res){
	res.render('payment/balance_withdrawals', {title: '余额提现'})
}
//收支明细
exports.incomeAndExpenditure = function(req, res){
	res.render('payment/income_and_expenditure', {title: '收支明细'})
}
//交易记录
exports.transactionRecord = function(req, res){
	res.render('payment/transaction_record', {title: '交易记录'})
}
//交易记录查询结果
exports.transactionSearchResult = function(req, res){
	res.render('payment/transaction_search_result', {title: '交易记录查询结果'})
}