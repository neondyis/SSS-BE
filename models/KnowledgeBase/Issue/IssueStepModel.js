const mongoose = require('mongoose');

const IssueStepSchema = new mongoose.Schema({
	issue:  {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Issue',
		required: true
	},
	stepNo: {
		type: Number,
		required: true
	},
	Content: {
		type: String,
		required: true,
	},
},{timestamps: true});
IssueStepSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('IssueStep', IssueStepSchema);
