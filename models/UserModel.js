const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	username: {type: String, required: true, unique: true},
	role: {type: Number, required: true, default: 0},
	isConfirmed: {type: Boolean, required: true, default: 0},
	confirmOTP: {type: String, required: false},
	otpTries: {type: Number, required: false, default: 0},
	status: {type: Boolean, required: true, default: 1},
}, {timestamps: true});


UserSchema.methods.toJSON = function() {
	const obj = this.toObject();
	delete obj.password;
	delete obj.confirmOTP;
	delete obj.otpTries;
	return obj;
};

module.exports = mongoose.model('User', UserSchema);
