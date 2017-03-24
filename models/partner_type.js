var mongoose = require('mongoose');
var partnerTypeSchema = require('../schemas/partner_type');
var PartnerType = mongoose.model('PartnerType', partnerTypeSchema);
module.exports = PartnerType;