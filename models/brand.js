const mongoose = require('mongoose');
const brandSchema = require('../schemas/brand');
const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;