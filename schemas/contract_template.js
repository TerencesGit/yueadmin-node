var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var contractTemplateSchema = new Schema({
	creator: {type: ObjectId, ref: 'User'},
	updater: {type: ObjectId, ref: 'User'},
	name: String,
	file_name: String,
	note: String,
	file: String,
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
contractTemplateSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next()
})
contractTemplateSchema.statics = {
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
module.exports = contractTemplateSchema;