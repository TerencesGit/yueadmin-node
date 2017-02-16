var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true
	},
	password: {
		type: String
	},
	name: {
		type: String
	},
	mobile: {
		type: String
	},
	qq: {
		type: String
	},
	gender: {
		type: Number,
		default: 0
	},
	birthday: {
		type: Date
	},
	idcard: {
		type: String
	},
	idcard_front: {
		type: String
	},
	idcard_back:{
		type: String
	},
	realname: {
		type: String
	},
	address: {
		type: String
	},
	signature: {
		type: String
	},
	avatar: {
		type: String
	},
	email_verified: {
		type: Number,
		default: 0
	},
	role: {
		type: Number,
		default: 1
	},
	status: {
		type: Number,
		default: 1
	},
	partner: {type: ObjectId, ref: 'Partner'},
	organize: {type: ObjectId, ref: 'Organize'},
	title: {type: ObjectId, ref: 'Title'},
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
userSchema.pre('save', function(next){
	var user = this;
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	var hash = bcrypt.hashSync(user.password);
	user.password = hash;
	next()
})
userSchema.methods = {
	comparePassword: function(_password, cb){
		bcrypt.compare(_password, this.password, function(err, isMatch){
			if(err) return cb(err)
				cb(null, isMatch)
		})
	}
}
userSchema.statics = {
	fetch: function(cb){
		return this
					.find({})
					.sort('-meta.updateAt')
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
							 .populate('partner', 'name')
							 .populate('organize', 'name')
							 .exec(function(err, results){
							 	if(err) {
							 		console.log(err)
							 	}else{
							 		_this.count(query, function(err, count){
							 			console.log(count)
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
module.exports = userSchema;