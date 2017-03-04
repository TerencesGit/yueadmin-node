var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var functionSchema = new Schema({
	creator: {type: ObjectId, ref: 'User'},
	updater: {type: ObjectId, ref: 'User'},
	name: String,
	router: String,
	desc: String,
	parent_id: String,
	level: {
		type: Number,
		default: 1
	},
	seq: {
		type: Number,
		default: 1
	},
	type: {
		type: Number,
		default: 1
	},
	status: {
		type: Number,
		default: 1
	},
	viewname: String,
	is_function_root: {
		type: Number,
		default: 0
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
functionSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next()
})
functionSchema.statics = {
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
module.exports = functionSchema;