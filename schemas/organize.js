var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var organizeSchema = new Schema({
	admin: {type: ObjectId, ref: 'User'},
	partner: {type: ObjectId, ref: 'Partner'},
	creator: {type: ObjectId, ref: 'User'},
	name: String,
	note: String,
	parent_id: String,
	is_partner_root: {
		type: Number,
		default: 0
	},
	status: {
		type: Number,
		default: 1
	},
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
organizeSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next()
})
organizeSchema.statics = {
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
module.exports = organizeSchema;