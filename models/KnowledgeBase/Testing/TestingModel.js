const mongoose = require('mongoose');
const KnowledgeBase = require('../KnowledgeBaseModel.js');

const TestSchema = new mongoose.Schema({
	knowledgeBase: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'KnowledgeBase',
		autopopulate: false,
		required: true
	},
	stageTest: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'StageTest',
		autopopulate: true,
		required: false
	}]
},{timestamps: true});
TestSchema.plugin(require('mongoose-autopopulate'));
TestSchema.pre('save', function(next) {
	if (!this.isNew) return next();
	KnowledgeBase.findByIdAndUpdate(this.knowledgeBase,{ $push: { test: this._id } },function(err,succ){
		if (err) {
			console.log(err);
		} else {
			console.log(succ);
		}
	});
	next();
});
module.exports = mongoose.model('Test', TestSchema);
