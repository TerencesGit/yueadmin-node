var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var contractTemplateSchema = new Schema({
	partner_id: String,
	party_a_name: String,
	party_b_name: String,
	party_c_name: String,
	sign_time: String,
	effetive_date: String,
	expire_date: String,
	template: {type: ObjectId, ref: 'ContractTemplate'},
	attach_file_1: String,
	attach_file_2: String,
	attach_file_3: String,
	attach_file_4: String,
	note: String,
	creator: {type: ObjectId, ref: 'User'},
	updater: {type: ObjectId, ref: 'User'},
	create_time:  {
		type: Date,
		default: Date.now()
	},
	update_time: {
		type: Date,
		default: Date.now()
	}
})
contractTemplateSchema.pre('save',function(next){
	if(this.isNew){
		this.create_time = this.update_time = Date.now();
	}else{
		this.update_time = Date.now();
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