var Partner = require('../models/partner');
var fs = require('fs');
var path = require('path');
var User = require('../models/user');
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
	var _partner = req.body.partner;
	_partner.admin = user._id;
	if(req.logo && req.license){
		_partner.logo = req.logo;
		_partner.license = req.license;
		Partner.findOne({admin: _partner.admin}, function(err, partner){
			if(err) return err;
			if(!partner){
				var partner = new Partner(_partner);
				partner.save(function(err, partner){
					console.log('注册成功')
					console.log(partner)
					User.update({_id: user._id},{$set: {partner: partner._id}}, function(err, msg){
						user.partner = partner._id;
						res.render('account/registered_partner_success',{title: '注册成功'})
					})
				})
			}else{
				console.log('该账号已经注册，不能重复注册！')
				res.redirect('/account/registered_partner')
			}
		})
	}else {
		res.redirect('/account/registered_partner')
	}
}
//企业信息展示
exports.showInfo = function(req, res){
	var user = req.session.user;
	if(user.partner){
		Partner.find({admin: user._id})
				 .populate('user', 'name')
				 .exec(function(err, partner){
				 		res.render('partner/partner_info',{title: '企业信息', partner: partner[0]})
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