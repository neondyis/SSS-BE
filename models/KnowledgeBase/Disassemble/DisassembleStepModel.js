const mongoose = require('mongoose');

const DisassembleStepSchema = new mongoose.Schema({
	disassemble:  {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Disassemble',
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
DisassembleStepSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('DisassembleStep', DisassembleStepSchema);
