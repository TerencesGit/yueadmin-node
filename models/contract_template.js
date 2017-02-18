var mongoose = require('mongoose');
var templateSchema = require('../schemas/contract_template');
var ContractTemplate = mongoose.model('ContractTemplate', templateSchema);
module.exports = ContractTemplate;