var mongoose = require('mongoose');
var titleSchema = require('../schemas/title');
var Title = mongoose.model('Title', titleSchema);
module.exports = Title;