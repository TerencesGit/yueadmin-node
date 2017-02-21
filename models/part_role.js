var mongoose = require('mongoose');
var partRoleSchema = require('../schemas/part_role');
var PartRole = mongoose.model('PartRole', partRoleSchema);
module.exports = PartRole;