const mongoose = require('mongoose');

const PassportSchema = new mongoose.Schema({
	vacuum: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Vacuum',
		autopopulate: true,
		required: true
	},
	services: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Service',
			autopopulate: true,
		}
	],
	timeline: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'History',
		autopopulate: true,
	}],
},{timestamps: true});
PassportSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Passport', PassportSchema);
