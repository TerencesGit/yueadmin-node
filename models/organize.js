var mongoose = require('mongoose');
var organizeSchema = require('../schemas/organize');
var Organize = mongoose.model('Organize', organizeSchema);
module.exports = Organize;