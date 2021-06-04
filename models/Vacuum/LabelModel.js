const mongoose = require('mongoose');

const LabelSchema = new mongoose.Schema({
	name: {type: String, required: true},
	color: {type: String, required: true},
	description: {
		type: String,
		required: true
	},
}, {timestamps: true});
LabelSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Label', LabelSchema);
