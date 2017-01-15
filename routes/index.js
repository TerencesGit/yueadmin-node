var express = require('express');
var router = express.Router();
var User = require('../controllers/user');
var Message = require('../controllers/message');
var Partner = require('../controllers/partner');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

/* GET 账户首页 */
router.get('/', User.signinRequired, User.showAccountInfo);

/* 登录注册 */
router.get('/signin', User.showSignin);
router.get('/signup', User.showSignup);

router.post('/user/signup', User.signup);
router.post('/user/signinAsync', User.signinAsync);
router.post('/user/signin', User.signin);

//退出
router.get('/logout', User.logout);

/* 管理员操作 */
router.get('/user/list', User.signinRequired, User.userlist);
router.get('/user/delete', User.signinRequired, User.delete);
router.post('/user/edit', User.signinRequired, User.edit);

/* 账号操作 */
router.get('/findByEmail', User.findByEmail);
router.get('/findByMobile', User.findByMobile);
router.get('/sendPhoneCode', User.sendPhoneCode);

/* 账户信息 */
router.get('/account', User.signinRequired, User.showAccountInfo);
router.get('/account/account_info', User.signinRequired, User.showAccountInfo);
router.get('/account/edit_info', User.signinRequired, User.showAccountEdit);
router.post('/account/save_info', User.signinRequired, User.saveInfo);
router.post('/account/avatarUpload', multipartMiddleware, User.avatarUpload);
router.post('/account/idcardUpload', multipartMiddleware, User.idcardFrontUpload, User.idcardBackUpload, User.idcardUpload);

//账号设置
router.get('/account/account_bind', User.signinRequired, User.accountBind);
router.get('/account/bind_mobile', User.showBindMobile);
router.post('/account/bind_mobile', User.bindMobile);
router.get('/account/verify_email', User.verifiedEmail);
router.get('/account/show_modify_email', User.showModifyEmail);
router.get('/account/modify_email', User.modifyEmail);
router.get('/account/modify_password', User.showModifyPassword);
router.post('/account/modify_password', User.modifyPassword);

//重置密码
router.get('/account/find_password', User.showFindPassword);
router.post('/account/show_send_email', User.showSendEmail);
router.get('/account/show_reset_password', User.showRestPassword);
router.post('/account/reset_password', User.resetPassword);

//注册企业
router.get('/account/registered_partner', User.showRegisteredPartner);
router.post('/partner/register', multipartMiddleware, Partner.logoUpload, Partner.licenseUpload, Partner.saveInfo);
router.get('/partner/partner_info', Partner.showInfo)
router.post('/partner/edit_info',multipartMiddleware, Partner.logoUpload, Partner.licenseUpload, Partner.EditInfo)
//企业审核
router.get('/admin/partner_manage', User.partnerManage);
router.get('/admin/show_partner', User.showPartner)
/* 组织管理 */
router.get('/company/department', User.departdment);
router.get('/company/company_info', User.conpanyIofo);

/* 留言功能 */
router.get('/message', Message.home);
router.post('/message/save', Message.save);
router.get('/message/delete', Message.delete);
/* 404 */
router.get('/404', function(req, res){
	res.render('404')
})

/* 500 */
router.get('/500', function(req, res){
	res.render('500')
})
/*ie9以下显示*/
router.get('/ie', function(req, res, next) {
  res.render('ie');
});
module.exports = router;
