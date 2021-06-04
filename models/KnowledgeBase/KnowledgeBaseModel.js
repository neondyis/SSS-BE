const mongoose = require('mongoose');

const KnowledgeBaseSchema = new mongoose.Schema({
	productType: {type: String, required: true},
	productModel: {type: String, required: false},
	diagnose: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Diagnose',
		autopopulate: true,
		required: false
	},
	disassemble: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Disassemble',
		autopopulate: true,
		required: false
	},
	repair: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Repair',
		autopopulate: true,
		required: false
	},
	test: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Test',
		autopopulate: true,
		required: false
	},
	// Diagrams: {}
},{timestamps: true});
KnowledgeBaseSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('KnowledgeBase', KnowledgeBaseSchema);
