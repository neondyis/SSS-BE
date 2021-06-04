const mongoose = require('mongoose');
const KnowledgeBase = require('../KnowledgeBaseModel.js');

const DiagnoseSchema = new mongoose.Schema({
	issues: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Issue',
		autopopulate: true,
		required: false,
	}],
	knowledgeBase: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'KnowledgeBase',
		autopopulate: false,
		required: true
	}
},{timestamps: true});
DiagnoseSchema.plugin(require('mongoose-autopopulate'));

/**
 * Pre-save hook
 */

DiagnoseSchema.pre('save', function(next) {
	if (!this.isNew) return next();
	KnowledgeBase.findByIdAndUpdate(this.knowledgeBase,{ $push: { diagnose: this._id } },function(err,succ){
		if (err) {
			console.log(err);
		} else {
			console.log(succ);
		}
	});
	next();
});

module.exports = mongoose.model('Diagnose', DiagnoseSchema);
