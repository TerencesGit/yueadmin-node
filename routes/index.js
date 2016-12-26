var express = require('express');
var router = express.Router();
var User = require('../controllers/user');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '悦视觉' });
});

/* 登录注册 */
router.get('/signin', User.showSignin);
router.get('/signup', User.showSignup);
router.get('/findByMobile', User.findByMobile);
router.get('/sendPhoneCode', User.sendPhoneCode);
router.post('/user/signup', User.signup);
router.post('/user/signin', User.signin);
router.get('/user/signin', User.home);

/*用户操作*/
router.get('/user/list', User.signinRequired, User.userlist);
router.get('/user/delete', User.signinRequired, User.delete);
router.post('/user/edit', User.signinRequired, User.edit);
router.get('/user/showUpdate', User.signinRequired, User.showUpdate);
router.post('/user/updatePassword', User.signinRequired, User.updatePassword);

router.get('/account/edit', User.signinRequired,  User.showEdit);
router.post('/user/avatarUpload', multipartMiddleware, User.avatarUpload);
//退出
router.get('/logout', User.logout);

/*ie9以下显示*/
router.get('/ie', function(req, res, next) {
  res.render('ie.ejs');
});
module.exports = router;
