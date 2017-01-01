var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true
	},
	password: {
		type: String,
		unique: true
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
		type: String
	},
	birthday: {
		type: Date
	},
	idcard: {
		type: String
	},
	realname: {
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
	avatar: {
		type: String
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
	}
}
module.exports = userSchema;