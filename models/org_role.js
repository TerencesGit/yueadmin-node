var mongoose = require('mongoose');
var orgRoleSchema = require('../schemas/org_role');
var OrgRole = mongoose.model('OrgRole', orgRoleSchema);
module.exports = OrgRole;