const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
	name: {type: String, required: true},
	color: {type: String, required: true},
	description: {
		type: String,
		required: true
	},
}, {timestamps: true});
StatusSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Status', StatusSchema);
