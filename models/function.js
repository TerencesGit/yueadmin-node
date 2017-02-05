var mongoose = require('mongoose');
var functionSchema = require('../schemas/function');
var Functions = mongoose.model('Functions', functionSchema);
module.exports = Functions;