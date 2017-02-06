var mongoose = require('mongoose');
var roleFuncSchema = require('../schemas/role_func');
var RoleFunc = mongoose.model('RoleFunc', roleFuncSchema);
module.exports = RoleFunc;