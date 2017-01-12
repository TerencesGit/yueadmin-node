var mongoose = require('mongoose');
var messageSchema = require('../schemas/message');
var Message = mongoose.model('Message', messageSchema);
module.exports = Message;