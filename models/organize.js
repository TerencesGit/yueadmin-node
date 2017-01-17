var mongoose = require('mongoose');
var organizeSchema = require('../schemas/organize');
var Organize = mongoose.model('organize', organizeSchema);
module.exports = Organize;