var mongoose = require('mongoose');
var partnerSchema = require('../schemas/partner');
var Partner = mongoose.model('Partner', partnerSchema);
module.exports = Partner;