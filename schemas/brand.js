var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var brandSchema = new Schema({
	// create_by: {type: ObjectId, ref: 'User'},
	// update_by: {type: ObjectId, ref: 'User'},
	brandId: String,
	brandName: String,
	content: String,
	logoUrl: String,
	brandPage: String,
	status: String,
	createTime: {
		type: Date,
		default: Date.now()
	},
	updateTime: {
		type: Date,
		default: Date.now()
	}
})
brandSchema.pre('save',function(next){
	if(this.isNew){
		this.createTime = this.updateTime = Date.now()
	}else{
		this.updateTime = Date.now()
	}
	next()
})
brandSchema.statics = {
	fetch: function(cb){
		return this
					.find({})
					.sort('meta.updateAt')
					.exec(cb)
	},
	findById: function(id, cb){
		return this
					.findOne({_id: id})
					.exec(cb)
	}
}
module.exports = brandSchema
