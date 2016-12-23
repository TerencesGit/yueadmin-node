var express = require('express');
var router = express.Router();
var User = require('../controllers/user');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '悦视觉' });
});

/* 登录注册 */
router.get('/findByMobile', User.findByMobile);
router.get('/signin', User.showSignin);
router.get('/signup', User.showSignup);
router.post('/user/signup', User.signup);
router.post('/user/signin', User.signin);
router.get('/user/signin', User.home)
router.get('/logout', User.logout);
router.get('/user/list', User.userlist);
router.get('/user/delete', User.delete);
router.post('/user/edit', User.edit);
router.get('/ie', function(req, res, next) {
  res.render('ie.ejs');
});
module.exports = router;
