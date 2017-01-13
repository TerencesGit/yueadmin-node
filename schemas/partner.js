var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var partnerSchema = new Schema({
	admin: {type: ObjectId, ref: 'User'},
	name: String,
	corporation: String,
	contact_name: String,
	contact_mobile: String,
	email: String,
	mobile: String,
	address: String,
	post: String,
	profile: String,
	logo: String,
	license: String,
	is_verified: {
		type: Number,
		default: 0
	},
	reject_info: String,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})
partnerSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next()
})
partnerSchema.statics = {
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
module.exports = partnerSchema;