const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
	vacuum: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Vacuum',
		autopopulate: true,
		required: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		autopopulate: true,
		required: true
	},
	status: {type: String, required: true},
	knowledgeBase: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'KnowledgeBase',
		autopopulate: true,
		required: false,
	},
},{timestamps: true});

ServiceSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Service', ServiceSchema);
