const mongoose = require('mongoose');

// TODO: Add validation
// check https://mongoosejs.com/docs/validation.html
const HistorySchema = new mongoose.Schema({
	content: {type: String, required: true},
	passport: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Passport',
		autopopulate: true,
		required: true
	},
},{timestamps: true});
HistorySchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('History', HistorySchema);
