var express = require('express');
var router = express.Router();
var User = require('../controllers/user');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

/* GET home page. */
router.get('/', function(req, res){
	res.render('account/account_info', {title: '悦视觉'})
});

/* 登录注册 */
router.get('/signin', User.showSignin);
router.get('/signup', User.showSignup);

router.post('/user/signup', User.signup);
router.post('/user/signinAsync', User.signinAsync);

router.post('/user/signin', User.signin);

router.get('/user/signin', User.home);

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
router.get('/account', User.accountHome);
router.get('/account/account_info', User.showAccountInfo);
router.get('/account/edit_info', User.signinRequired, User.showEdit);
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

router.get('/account/find_password', User.findPassword);
router.get('/account/reset_password', User.showResetPassword);
router.post('/account/reset_password', User.resetPassword);
//注册公司
router.get('/account/show_registered_company', User.showRegisteredCompany)
/* 公司管理 */
router.get('/company/department', User.departdment)
router.get('/company/company_info', User.conpanyIofo)

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
