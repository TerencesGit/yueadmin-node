var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var titleSchema = new Schema({
	creator: {type: ObjectId, ref: 'User'}, 
	updater: {type: ObjectId, ref: 'User'}, 
	partner: {type: ObjectId, ref: 'Partner'}, 
	name: String,
	desc: String,
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
titleSchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next()
})
titleSchema.statics = {
	fetch: function(cb){
		return this
					.find({})
					.sort('meta.createAt')
					.exec(cb)
	},
	findById: function(id, cb){
		return this
					.findOne({_id: id})
					.exec(cb)
	}
}
module.exports = titleSchema;