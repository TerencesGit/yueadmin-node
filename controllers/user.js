var User = require('../models/user');
var Message = require('../models/message');
var Partner = require('../models/partner');
var Notice = require('../models/notice');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

//注册页
exports.showSignup = function(req, res, next) {
  res.render('signup', { title: '欢迎注册' })
}
//登录页
exports.showSignin = function(req, res, next) {
  res.render('signin', { title: '欢迎登录' })
}
//查询邮箱号
exports.findByEmail = function(req, res, next) {
  var email = Trim(req.query.number);
  User.findOne({ email: email }, function(err, user) {
    if (err) console.log(err)
    if (user) {
      res.json({ status: 1 })
    } else {
      res.json({ status: 0 })
    }
  })
}
//查询手机号
exports.findByMobile = function(req, res, next) {
  var mobile = Trim(req.query.number);
  User.findOne({ mobile: mobile }, function(err, user) {
    if (err) console.log(err)
    if (user) {
      res.json({ status: 1 })
    } else {
      res.json({ status: 0 })
    }
  })
}
//发送验证码
exports.sendPhoneCode = function(req, res) {
  var user = req.session.user;
  var mobile = req.query.mobile;
  var code = createCode();
  user.code = code;
  var interval = getRandom(3, 8) * 1000;
  setTimeout(function() {
    res.json({ code: code })
  }, interval)
}
//生成验证码
function createCode() {
  const codeLength = 4;
  const alphabet = '1234567890';
  code = '';
  for (var i = 0, len = alphabet.length; i < codeLength; i++) {
    code += alphabet.charAt(Math.floor(Math.random() * len))
  }
  return code;
}
//随机数范围
function getRandom(min, max) {;
  return Math.floor(Math.random() * (max - min)) + min;
}
//去除前后空格
function Trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '');
}
//注册功能
exports.signup = function(req, res) {
  var _user = req.body.user;
  var email = Trim(_user.email);
  var sessionUser = req.session.user;
  if (sessionUser) {
    _user.partner = sessionUser.partner._id;
  }
  User.findOne({ email: email }, function(err, user) {
    if (err) console.log(err)
    if (!user) {
      if (!_user.name) {
        _user.name = email;
      }
      var userObj = new User(_user);
      userObj.save(function(err, user) {
        if (err) {
          _user.error = '注册失败，系统错误';
          return res.render('signup', { title: '欢迎注册', user: _user })
        }
        if (sessionUser) {
          return res.json({ status: 1 })
        }
        req.session.user = user;
        res.redirect('/')
      })
    } else {
      _user.error = '注册失败，该邮箱号已经被注册！';
      res.render('signup', { title: '欢迎注册', user: _user })
    }
  })
}
//异步登录功能
exports.signinAsync = function(req, res) {
  var _user = req.body.user;
  var name = _user.name,
      passwd = _user.passwd;
  var emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (!emailReg.test(name)) {
    User.findOne({ mobile: name }, function(err, user) {
      if (err) console.log(err)
      if (!user) {
        return res.json({ status: 0 })
      }
      user.comparePassword(passwd, function(err, isMatch) {
        if (err) console.log(err)
        if (isMatch) {
          req.session.user = user;
          setTimeout(function() {
            return res.json({ status: 2 })
          }, 2000)
        } else {
          return res.json({ status: 1 })
        }
      })
    })
  } else {
    User.findOne({ email: name }, function(err, user) {
      if (err) console.log(err)
      if (!user) {
        return res.json({ status: 0 })
      }
      user.comparePassword(passwd, function(err, isMatch) {
        if (err) console.log(err)
        if (isMatch) {
          req.session.user = user;
          setTimeout(function() {
            res.json({ status: 2 })
          }, 2000)
        } else {
          res.json({ status: 1 })
        }
      })
    })
  }
}
// 异步注册
exports.register = function (req, res) {
  console.log(req.body)
  const user = req.body
        email = user.name,
        password = user.pass;
  User.findOne({ email: email }, function(err, user) {
    if (err) {
      console.log(err)
      return res.json({status: 0, message: '系统错误，请重试'})
    } 
    if (!user) {
      setTimeout(() => {
        res.json({status: 1, message: '注册成功，请登录'}) 
      }, 1000)
    } else {
       setTimeout(() => {
        res.json({status: 2, message: '该邮箱号已被注册'})
      }, 1000)
    }
  })
}
// 异步登录
exports.login = function(req, res) {
  console.log(req.body)
  const TIME = 1000
  const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  const user = req.body,
        name = user.username,
        passwd = user.password;
  if (!emailReg.test(name)) {
    User.findOne({ mobile: name }, function(err, user) {
      if (err) console.log(err)
      if (!user) {
        setTimeout(() => {
          return res.json({ status: 0, message: '用户名不存在' })
        }, TIME)
      }else {
        user.comparePassword(passwd, function(err, isMatch) {
          if (err) console.log(err)
          if (isMatch) {
            req.session.user = user;
            setTimeout(() => {
              return res.json({ status: 1, message: '登录成功' })
            }, TIME)
          } else {
            setTimeout(() => {
              return res.json({ status: 2, message: '密码错误' })
            }, TIME)
          }
        })
      }
    })
  } else {
    User.findOne({ email: name }, function(err, user) {
      if (err) console.log(err)
      if (!user) {
        setTimeout(() => {
          return res.json({ status: 0, message: '用户名不存在' })
        }, TIME)
      }else {
        user.comparePassword(passwd, function(err, isMatch) {
          if (err) console.log(err)
          if (isMatch) {
            req.session.user = user;
            console.log(req.sessionID)
            console.log(user._id)
            setTimeout(function() {
              return res.json({ 
                status: 1, 
                sessionId: req.sessionID, 
                userId: user._id, 
                message: '登录成功'
              })
            }, TIME)
          } else {
            setTimeout(function(){
              return res.json({ status: 2, message: '密码错误' })
            }, TIME)
          }
        })
      }
    })
  }
}
// 用户权限
exports.userPermission = function(req, res) {
  const partner = {
    name: '悦视觉摄影'
  }
  const permission = [
    {
      name: '账户管理',
      icon: 'fa-user',
      children: [
        {name: '账户首页', link: '/account/home', index: '/account/home'}
        // {name: '账户编辑', link: '/account/edit', index: '1-2'},
        // {name: '账户安全', link: '/account/security', index: '1-3'}
      ]
    },
    {
      name: '供应商',
      icon: 'fa-paw',
      children: [
        {name: '品牌管理', link: '/provider/brandManage', index: '/provider/brandManage'},
        {name: '商品管理', link: '/provider/wareManage', index: '/provider/wareManage'},
        {name: '订单管理', link: '/provider/orderManage', index: '/provider/orderManage'},
        {name: '销售报表', link: '/provider/salesReport', index: '/provider/salesReport'},
        {name: '发票管理', link: '/provider/invoiceManage', index: '/provider/invoiceManage'},
        {name: '顾客管理', link: '/provider/customerManage', index: '/provider/customerManage'},
      ]
    },
    {
      name: '分销商',
      icon: 'fa-sitemap',
      children: [
        {name: '订单管理', link: '/distributor/orderManage', index: '/distributor/orderManage'}
      ]
    },
    {
      name: '平台管理员',
      icon: 'fa-desktop',
      children: [
        {name: '商品上架审核', link: '/admin/wareAudit', index: '/admin/wareAudit'}
      ]
    },
    {
      name: '工具演示',
      icon: 'fa-wrench',
      children: [
        {name: 'Vue-Html5-Editor', link: '/tools/vueHtml5Editor', index: '/tools/vueHtml5Editor'},
        {name: 'UEditor', link: '/tools/UEditor', index: '/tools/UEditor'}
      ]
    }
  ]
  res.json({status: '200',permission: permission, name: 'Transform', partner: partner})
}
//同步登录功能
exports.signin = function(req, res) {
  var _user = req.body.user;
  var name = _user.username,
      passwd = _user.password,
      remember = _user.remember;
  console.log(_user);
  console.log(remember)
  var emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (!emailReg.test(name)) {
    User.findOne({ mobile: name }, function(err, user) {
      if (err) return err;
      if (!user) {
        _user.error = '用户名不存在！'
        return res.render('signin', { title: '欢迎登录', user: _user })
      }
      user.comparePassword(passwd, function(err, isMatch) {
        if (err) return err;
        if (isMatch) {
          req.session.user = user;
          res.redirect('/')
        } else {
          _user.error = '密码不正确！';
          return res.render('signin', { title: '欢迎登录', user: _user })
        }
      })
    })
  } else {
    User.findOne({ email: name })
      .populate('partner', 'name')
      .populate('organize', 'name')
      .exec(function(err, user) {
        if (err) return err;
        if (!user) {
          _user.error = '用户名不存在！'
          return res.render('signin', { title: '欢迎登录', user: _user })
        }
        user.comparePassword(passwd, function(err, isMatch) {
          if (err) return err;
          if (isMatch) {
            console.log(user)
            req.session.user = user;
            
            res.redirect('/')
          } else {
            _user.error = '密码不正确！';
            return res.render('signin', { title: '欢迎登录', user: _user })
          }
        })
      })
  }
}
//退出功能
exports.logout = function(req, res) {
  delete req.session.user;
  delete req.session.notices;
  res.redirect('/signin')
}
exports.exit = function(req, res) {
  delete req.session.user;
  res.json({status: 1, message: '退出成功'})
}
//绑定手机号
exports.bindMobile = function(req, res) {
  var _user = req.body.user,
    mobile = _user.mobile,
    phonecode = Trim(_user.phonecode);
  var userObj = req.session.user,
    id = userObj._id,
    usercode = userObj.code;
  if (id) {
    if (phonecode !== usercode) {
      console.log('手机验证码错误')
      userObj.error = '手机验证码有误！';
      return res.render('account/account_bind', { title: '账号安全', tabIndex: 1, user: userObj })
    }
    User.update({ _id: id }, { '$set': { mobile: mobile } }, function(err, msg) {
      if (err) return err;
      userObj.mobile = mobile;
      userObj.success = '手机号绑定成功！';
      req.session.user = userObj;
      console.log('绑定成功！')
      return res.render('account/account_bind', { title: '账号安全', tabIndex: 1, user: userObj })
    })
  } else {
    res.redirect('/signin')
  }
}
//验证邮箱
exports.verifiedEmail = function(req, res) {
  var email = req.body.email;
  console.log(email)
  User.findOne({ email: email }, function(err, user) {
    if (user) {
      User.update({ email: email }, { '$set': { email_verified: 1 } }, function(err, msg) {
        if (err) return err;
        console.log('邮箱验证成功！')
        req.session.user = user;
        res.json({ status: 1 })
      })
    } else {
      res.json({ status: 0 })
    }
  })
}
//修改邮箱页
exports.showModifyEmail = function(req, res) {
  res.render('account/account_bind', { title: '账号安全', tabIndex: 2 })
}
//修改邮箱
exports.modifyEmail = function(req, res) {
  var email = req.query.email;
  var _user = req.session.user,
    id = _user._id;
  if (id) {
    User.update({ _id: id }, { '$set': { email: email } }, function(err, msg) {
      if (err) return err;
      _user.email = email;
      req.session.user = _user;
      res.redirect('/account/account_bind')
    })
  } else {
    res.redirect('/signin')
  }
}
//修改密码页
exports.showModifyPassword = function(req, res) {
  res.render('account/modify_password', { title: '账号安全' })
}
//修改密码
exports.modifyPassword = function(req, res) {
  var _user = req.body.user,
    password = _user.oldpasswd,
    newPasswd = _user.newpasswd;
  var userSession = req.session.user,
    id = userSession._id,
    email = userSession.email;
  User.findOne({ _id: id }, function(err, user) {
    if (err) console.log(err)
    if (!user) {
      return res.redirect('/signin')
    }
    user.comparePassword(password, function(err, isMatch) {
      if (err) console.log(err)
      if (isMatch) {
        user.email = email;
        user.password = newPasswd;
        user.save(function(err, user) {
          if (err) console.log(err)
          user.success = '密码修改成功！';
          req.session.user = user;
          return res.render('account/account_bind', { title: '账号安全', tabIndex: 3, user: user })
        })
      } else {
        userSession.error = '原密码不正确';
        return res.render('account/account_bind', { title: '账号安全', tabIndex: 3, user: userSession })
      }
    })
  })
}
//找回密码
exports.showFindPassword = function(req, res) {
  res.render('account/find_password', { title: '找回密码' })
}
//发送邮件提示页
exports.getSendEmail = function(req, res) {
  res.render('account/reset_send_email', { title: '邮件发送成功' })
}
//发送邮件提示页
exports.showSendEmail = function(req, res) {
  var email = req.body.email;
  User.findOne({ email: email }, function(err, user) {
    if (err) return err;
    if (user) {
      req.session.user = user;
      res.render('account/reset_send_email', { title: '邮件发送成功', user: user })
    } else {
      res.redirect('/signin')
    }
  })
}
//重置密码页
exports.showRestPassword = function(req, res) {
  res.render('account/reset_password', { title: '重置密码' })
}
//重置密码功能
exports.resetPassword = function(req, res) {
  var _user = req.body.user;
  var newpasswd = _user.newpasswd;
  var user = req.session.user;
  var id = user._id;
  User.findOne({ _id: id }, function(err, user) {
    if (err) console.log(err);
    if (!user) {
      return redirect('/signin')
    }
    user.comparePassword(newpasswd, function(err, isMatch) {
      if (err) return err;
      if (isMatch) {
        user.error = '新密码不得与原密码重复';
        return res.render('account/reset_password', { title: '重置密码', user: user })
      } else {
        user.password = newpasswd;
        user.save(function(err, user) {
          if (err) return err;
          return res.render('account/reset_password_success', { title: '重置密码成功' })
        })
      }
    })
  })
}
//重置密码成功页
exports.resetPasswdSuccess = function(req, res) {
  res.render('account/reset_password_success', { title: '重置密码成功' })
}
//登录验证
exports.signinRequired = function(req, res, next) {
  var user = req.session.user;
  if (!user) {
    return res.redirect('/signin')
  }
  next()
}
//管理员权限
exports.adminRequired = function(req, res, next) {
  var user = req.session.user;
  if (user.role < 20) {
    return res.redirect('/signup')
  }
}
//账户信息
exports.showAccountInfo = function(req, res) {
  var user = req.session.user;
  Notice.fetch(function(err, notices) {
    req.session.notices = notices;
    if (err) console.log(notices)
    Message.find()
      .sort('-meta.createAt')
      .populate('user', 'avatar name')
      .exec(function(err, messages) {
        res.render('account/account_info', {
          title: '账户信息',
          notices: notices,
          messages: messages
        })
      })
  })
}
//账户信息编辑
exports.showAccountEdit = function(req, res) {
  res.render('account/account_info_edit', { title: '账户信息编辑' })
}
//头像上传
exports.avatarUpload = function(req, res, next) {
  var user = req.session.user;
  var avatarData = req.files.avatar;
  if (avatarData && avatarData.originalFilename) {
    var filePath = avatarData.path;
    fs.readFile(filePath, function(err, data) {
      var timestamp = Date.now();
      var type = avatarData.name.split('.')[1];
      var avatar = 'avatar_' + timestamp + '.' + type;
      var newPath = path.join(__dirname, '../', 'public/upload/avatar/' + avatar);
      fs.writeFile(newPath, data, function(err) {
        req.avatar = avatar;
        next()
      })
    })
  } else {
    next()
  }
}
//身份证正面上传
exports.idcardFrontUpload = function(req, res, next) {
  var idcardData = req.files.idcard_front;
  console.log(idcardData)
  if (idcardData && idcardData.originalFilename) {
    var idcardPath = idcardData.path;
    fs.readFile(idcardPath, function(err, data) {
      var timestamp = Date.now();
      var type = idcardData.name.split('.')[1];
      var idcardFront = 'idcard_front_' + timestamp + '.' + type;
      var newPath = path.join(__dirname, '../', 'public/upload/idcard/' + idcardFront);
      fs.writeFile(newPath, data, function(err) {
        req.idcardFront = idcardFront;
        next()
      })
    })
  } else {
    next()
  }
}
//身份证反面上传
exports.idcardBackUpload = function(req, res, next) {
  var idcardData = req.files.idcard_back;
  if (idcardData && idcardData.originalFilename) {
    var idcardPath = idcardData.path;
    fs.readFile(idcardPath, function(err, data) {
      var timestamp = Date.now();
      var type = idcardData.name.split('.')[1];
      var idcardBack = 'idcard_back_' + timestamp + '.' + type;
      var newPath = path.join(__dirname, '../', 'public/upload/idcard/' + idcardBack);
      fs.writeFile(newPath, data, function(err) {
        req.idcardBack = idcardBack;
        next()
      })
    })
  } else {
    next()
  }
}
//账户信息保存
exports.saveInfo = function(req, res) {
  var userObj = req.body.user;
  userObj.idcard = Trim(userObj.idcard);
  userObj.address = Trim(userObj.address);
  if (req.avatar) {
    userObj.avatar = req.avatar;
  }
  if (req.idcardFront) {
    userObj.idcard_front = req.idcardFront;
  }
  if (req.idcardBack) {
    userObj.idcard_back = req.idcardBack;
  }
  var id = req.session.user._id;
  if (id) {
    User.update({ _id: id }, { '$set': userObj }, function(err, msg) {
      if (err) return err;
      var _user = _.assign(req.session.user, userObj);
      req.session.user = _user;
      res.redirect('/')
    })
  } else {
    res.redirect('/signin')
  }
}
//账号安全
exports.accountBind = function(req, res) {
  var user = req.session.user;
  user.error = '';
  user.success = '';
  res.render('account/account_security', { title: '账号安全', tabIndex: 0 })
}
//手机号绑定页
exports.showBindMobile = function(req, res) {
  res.render('account/bind_mobile', { title: '手机绑定' })
}
//手机号修改页
exports.showModifyMobile = function(req, res) {
  res.render('account/modify_mobile', { title: '手机号修改' })
}
//注册我的企业
exports.showRegisteredPartner = function(req, res) {
  var user = req.session.user;
  return res.render('account/registered_partner', { title: '注册我的企业' })
  if (!user.partner) {
    return res.render('account/registered_partner', { title: '注册我的企业' })
  } else {
    Partner.findOne({ admin: user._id }, function(err, partner) {
      if (partner.is_verified == 0 || partner.is_verified == 3) {
        res.render('account/registered_partner_submit', { title: '等待审核' })
      } else if (partner.is_verified == 2) {
        res.render('account/registered_partner_result', { title: '未通过审核', partner: partner })
      } else {
        res.redirect('/partner/partner_info')
      }
    })
  }
}
//等待审核
exports.registeredPartnerSuccess = function(req, res) {
  var partner = {
    msg: '您的企业注册信息已提交！'
  }
  res.render('account/registered_partner_submit', { title: '等待审核', partner: partner })
}
//审核不通过
exports.registeredPartnerResult = function(req, res) {
  var partner = {
    info: '信息填写不完整'
  }
  res.render('account/registered_partner_result', { title: '未通过审核', partner: partner })
}
/* 管理员操作 */
//用户列表
exports.userlist = function(req, res) {
  var page = {
    number: req.query.page || 1,
    limit: 10
  }
  var search = req.query.search || {};
  if (req.query.page) {
    page.number = req.query.page < 1 ? 1 : req.query.page;
  }
  var model = {
    page: page,
    search: search
  }
  var totalNumber;
  User.find({})
    .exec(function(err, users) {
      if (err) console.log(err)
      totalNumber = users.length;
    })
  User.findByPagination(model, function(err, pageIndex, pageCount, users) {
    res.render('admin/userlist', {
      title: '用户列表',
      users: users,
      pageCount: pageCount,
      pageIndex: pageIndex,
      totalNumber: totalNumber
    })
  })
}
//用户删除
exports.delete = function(req, res) {
  var uid = req.query.uid;
  if (uid) {
    User.remove({ _id: uid }, function(err, user) {
      if (err) console.log(err)
      res.json({ status: 1 })
    })
  }
}
//用户信息编辑
exports.edit = function edit(req, res) {
  var _user = req.body.user,
    id = _user.id;
  User.update({ _id: id }, { '$set': _user }, function(err, msg) {
    if (err) console.log(err);
    res.redirect('/user/list')
  })
}
//用户详情
exports.userDetail = function(req, res) {
  var id = req.query.id;
  User.findById(id, function(err, user) {
    if (err) console.log(err);
    var messages = [];
    res.render('account/account_info', { title: '账户信息', user: user, messages: messages })
  })
}