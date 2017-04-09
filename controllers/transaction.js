const Partner = require('../models/partner');
const User = require('../models/user');
const Role = require('../models/role');
const Organize = require('../models/organize');
const Notice = require('../models/notice');
const _ = require('lodash');

//交易平台 订单
exports.home = function(req, res){
	res.render('transaction/order_manage', {title: '订单列表'})
}