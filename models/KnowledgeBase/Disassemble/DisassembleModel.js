const mongoose = require('mongoose');
const KnowledgeBase = require('../KnowledgeBaseModel.js');

const DisassembleSchema = new mongoose.Schema({
	content: {type: String, required: true},
	step: {type: Number, required: true,order:-1},
	knowledgeBase: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'KnowledgeBase',
		autopopulate: false,
		required: true
	}
},{timestamps: true});
DisassembleSchema.plugin(require('mongoose-autopopulate'));

DisassembleSchema.pre('save', function(next) {
	if (!this.isNew) return next();
	KnowledgeBase.findByIdAndUpdate(this.knowledgeBase,{ $push: { disassemble: this._id } },function(err,succ){
		if (err) {
			console.log(err);
		} else {
			console.log(succ);
		}
	});
	next();
});
module.exports = mongoose.model('Disassemble', DisassembleSchema);
