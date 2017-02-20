var mongoose = require('mongoose');
var contractSchema = require('../schemas/contract');
var Contract = mongoose.model('Contract', contractSchema);
module.exports = Contract;