var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var partnerSchema = new Schema({
	admin: {type: ObjectId, ref: 'User'},
	name: String,
	corporation: String,
	license_id: String,
	contact_name: String,
	contact_mobile: String,
	email: String,
	telephone: String,
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
	},
	findByPagination: function(obj, callback){
		var query = obj.search || {};
		var pageNumber = obj.page.number || 1;
		var pageSize = obj.page.limit || 5;
		var skipFrom = (pageNumber * pageSize) - pageSize;
		var _this = this;
		return this.find({})
							 .sort('-meta.updateAt')
							 .skip(skipFrom)
							 .limit(pageSize)
							 .exec(function(err, results){
							 	if(err) {
							 		console.log(err)
							 	}else{
							 		_this.count(query, function(err, count){
							 			if(err){
							 				console.log(err)
							 			}else{
							 				var pageCount = Math.ceil(count / pageSize);
							 				callback(null, pageNumber, pageCount, results)
							 			}
							 		})
							 	}
							 })
	}
}
module.exports = partnerSchema;