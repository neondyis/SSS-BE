const mongoose = require('mongoose');

const PartSchema = new mongoose.Schema({
	name:  {type: String, required: true},
	partNo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Diagnose',
		autopopulate: true,
		required: false
	},
},{timestamps: true});
PartSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Part', PartSchema);
