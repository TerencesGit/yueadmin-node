var mongoose = require('mongoose');
var partTypeRoleSchema = require('../schemas/partType_role');
var PartTypeRole = mongoose.model('PartTypeRole', partTypeRoleSchema);
module.exports = PartTypeRole;