const mongoose = require('mongoose');

const VacuumSchema = new mongoose.Schema({
	series: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Series',
		autopopulate: true,
		required: true
	},
	passport: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Passport',
		autopopulate: true,
		required: false
	},
	label: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Label',
		autopopulate: true,
		required: false
	},
	status: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Status',
		autopopulate: true,
		required: true
	},
	model: {type: String, required: false},
	type: {type: String, required: true},
},{timestamps: true});
VacuumSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Vacuum', VacuumSchema);

