const express = require('express');
const router = express.Router();
const User = require('../controllers/user');
const Admin = require('../controllers/admin');
const Message = require('../controllers/message');
const Partner = require('../controllers/partner');
const System = require('../controllers/system');
const Installment = require('../controllers/installment');
//const Transaction = require('../controllers/transaction');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

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
router.get('/user/user_detail', User.signinRequired, User.userDetail);

/* 账号操作 */
router.get('/findByEmail', User.findByEmail);
router.get('/findByMobile', User.findByMobile);
router.get('/sendPhoneCode', User.sendPhoneCode);

/* 账户信息 */
router.get('/account', User.signinRequired, User.showAccountInfo);
router.get('/account/account_info', User.signinRequired, User.showAccountInfo);
router.get('/account/account_info_edit', User.signinRequired, User.showAccountEdit);
router.post('/account/save_info', User.signinRequired, multipartMiddleware, User.avatarUpload, User.idcardFrontUpload, User.idcardBackUpload, User.saveInfo);

//账号设置
router.get('/account/account_security', User.signinRequired, User.accountBind);
router.get('/account/bind_mobile', User.showBindMobile);
router.post('/account/bind_mobile', User.bindMobile);
router.post('/account/verify_email', User.verifiedEmail);
router.get('/account/show_modify_email', User.showModifyEmail);
router.get('/account/modify_email', User.modifyEmail);
router.get('/account/modify_password', User.showModifyPassword);
router.post('/account/modify_password', User.modifyPassword);
router.get('/account/modify_mobile', User.showModifyMobile);

//重置密码
router.get('/account/find_password', User.showFindPassword);
router.post('/account/show_send_email', User.showSendEmail);
router.get('/account/show_send_email', User.getSendEmail);
router.get('/account/show_reset_password', User.showRestPassword);
router.post('/account/reset_password', User.resetPassword);
router.get('/account/reset_password', User.resetPasswdSuccess);

//注册企业 
router.get('/account/registered_partner', User.showRegisteredPartner);
//返回重新填写
router.get('/account/show_registered_partner', Partner.showRegistered);
//注册信息提交
router.post('/partner/register', Partner.isPartnerRegisterd, multipartMiddleware, Partner.logoUpload, Partner.licenseUpload, Partner.saveInfo);
//返回重新填写提交
router.post('/partner/register_rewrite', multipartMiddleware, Partner.logoUpload, Partner.licenseUpload, Partner.saveRewriteInfo);
//企业信息展示
router.get('/partner/partner_info', Partner.isPartnerPass, Partner.showInfo)

router.get('/partner/partner_info_edit', Partner.isPartnerPass, Partner.showInfoEdit)
router.post('/partner/edit_info', Partner.isPartnerPass, multipartMiddleware, Partner.logoUpload, Partner.licenseUpload, Partner.EditInfo)

router.get('/account/registered_partner_success', User.registeredPartnerSuccess)
router.get('/account/registered_partner_result', User.registeredPartnerResult)

//企业组织管理
router.get('/partner/organize_manage', Partner.isPartnerPass, Partner.organizeManage);

router.get('/partner/get_organize_tree', Partner.getOrganizeTree);
router.get('/partner/get_organize_staff', Partner.getOrganizeStaff);

router.post('/partner/new_organize', Partner.newOrganize);
router.post('/partner/edit_organize', Partner.editOrganize);
router.get('/partner/remove_organize', Partner.removeOrganize);

//权限设置
router.post('/partner/set_org_role', Partner.setOrgRole);
router.get('/partner/get_org_role', Partner.getRolesByOrgId);

//功能查看
router.get('/partner/get_func_by_org', Partner.getFuncsByOrgId);

//状态设置
router.get('/partner/set_org_status', Partner.setOrgStatus);

//员工管理
router.get('/partner/staff_manage', Partner.isPartnerPass, Partner.staffManage);
router.post('/partner/staff_search', Partner.staffSearch);
router.get('/partner/set_staff_org', Partner.setStaffOrganize);
router.get('/partner/get_staff_title', Partner.getStaffTitle);
router.get('/partner/set_staff_title', Partner.setStaffTitle);
router.get('/partner/set_staff_status', Partner.setStaffStatus);
router.get('/partner/show_staff_info', Partner.showStaffInfo);

//账户代注册
router.get('/partner/agent_register', Partner.agentRegister)
router.post('/partner/agent_register', User.signup)

//岗位管理
router.get('/partner/title_manage', Partner.isPartnerPass, Partner.showTitleManage)
router.post('/partner/new_title', Partner.newTitle)
router.post('/partner/edit_title', Partner.editTitle)
router.get('/partner/remove_title', Partner.removeTitle)

/* 管理员操作 */

//企业审核
router.get('/admin/partner_manage', Admin.managePartner);
router.get('/admin/verify_partner', Admin.verifiedPartner);
router.get('/admin/verify_partner_pass', Admin.verifiedPass);
router.post('/admin/verify_partner_nopass', Admin.verifiedNoPass);

//合同模板管理
router.get('/admin/contract_template_manage', Admin.contractTemplateManage);
router.get('/admin/new_contract_template', Admin.newContractTemplate)
router.post('/admin/save_template', multipartMiddleware, Admin.saveTemplateFile, Admin.saveTemplate);
router.get('/admin/edit_contract_template', Admin.editTemplate);
router.get('/admin/remove_contract_template', Admin.removeTemplate);
router.get('/admin/contract_template_download', Admin.downloadTemplate);

//合同管理
router.get('/admin/contract_manage', Admin.contractManage)
router.get('/admin/new_contract', Admin.newContract)
router.post('/admin/save_contract', multipartMiddleware, Admin.attachUpload1, Admin.saveContract)
router.get('/admin/edit_contract', Admin.editContract)
router.get('/admin/remove_contract', Admin.removeContract)

//权限管理
router.get('/admin/jurisdiction_manage', Admin.jurisdictionManage);
router.get('/admin/show_partner_info', Admin.showPartnerInfo);
router.post('/admin/set_partner_role', Admin.setPartnerRole);
router.get('/admin/get_role_by_partner', Admin.getRoleByPartner);
router.get('/admin/set_partner_status', Admin.setPartnerStatus);

/* 系统管理 */

//系统功能树
router.get('/system/function_manage', System.showFunctionTree);
router.post('/system/new_function', System.newFunction);
router.get('/system/get_function_tree', System.getFunctionTree);
router.post('/system/edit_function', System.editFunction);
router.get('/system/remove_function', System.removeFunction);
router.get('/system/get_function_node', System.getFunctionNode);

//角色管理
router.get('/system/role_manage', System.showRoleManage);
router.post('/system/new_role', System.newRole);
router.get('/system/role_remove', System.removeRole);
router.post('/system/assign_function', System.assignFunction);
router.get('/system/role_func_list', System.roleFuncList);
router.get('/system/get_role_func', System.getRoleFunc);

//公告管理
router.get('/system/notice_manage', System.noticeManage);
router.get('/system/notice_release', System.noticeRelease);
router.post('/system/save_notice', multipartMiddleware, System.noticeFileUpload, System.saveNotice);
router.get('/system/notice_detail', System.noticeDetail);
router.get('/system/notice_edit', System.noticeEdit);
router.get('/system/notice_remove', System.noticeRemove);

//账户管理
router.get('/system/account_manage', System.accountManage);
router.get('/system/show_account_info', System.showAccountInfo);
router.get('/system/set_account_status', System.setAccountStatus);
router.get('/system/remove_account', System.removeAccount);

/** 交易平台 **/
//首页
//router.get('/transaction/home', Transaction.home)



/** 分期贷款 **/
//平台管理
router.get('/admin/installment', Installment.signin);
router.get('/admin/merchant_manage', Installment.home);
router.get('/admin/merchant_agent_register', Installment.showMerchantRegistration);
router.post('/admin/merchant_registration', Installment.merchantRegistration);
router.get('/admin/show_merchant_info', Installment.merchantInfo);
router.get('/admin/merchant_info_edit', Installment.merchantInfoEdit);
router.get('/admin/financial_service', Installment.financialService);
router.get('/admin/new_financial_service', Installment.newFinancialService);
router.get('/admin/account_manage', Installment.accountManage);
router.get('/admin/show_account_info', Installment.accountInfo);
router.get('/admin/financial_manage', Installment.financialManage);
router.get('/admin/installment_manage', Installment.installmentlManage);

//用户操作
router.get('/user/installment', Installment.signin);
router.get('/user/show_installment', Installment.myInsatllment);
router.get('/user/installment_manage', Installment.myInsatllment);
router.get('/user/installment_share', Installment.insatllmentShare);
router.get('/user/financial_contract', Installment.financialContract);
router.get('/user/merchant_info', Installment.myMerchantInfo);


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