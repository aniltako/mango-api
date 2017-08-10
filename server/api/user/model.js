var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var logger = require('../../utils/logger');

var UserSchema = new Schema({
	
	username:{
		type: String,
		require: true,
		unique: true
	},
	password: {
		type: String,
		require:true
	},
	email: {
		type: String,
		require:true,
		unique: true
	}
});

UserSchema.pre('save', function(next){
	if(!this.isModified('password'))
		return next();
	this.password = this.encryptPassword(this.password);
	next();
})

UserSchema.methods = {
	authenticate: function(plainTextPword){
		logger.log("Checking password");
		return bcrypt.compareSync( plainTextPword, this.password);
	},
	encryptPassword: function(plainTextPword){
		if(!plainTextPword){
			return ''
		}else{
			var salt = bcrypt.genSaltSync(10);
			return bcrypt.hashSync(plainTextPword,salt);
		}
	}
};

module.exports = mongoose.model('user', UserSchema);