const mongoose = require('mongoose');
const KnowledgeBase = require('../KnowledgeBaseModel.js');

const RepairSchema = new mongoose.Schema({
	knowledgeBase: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'KnowledgeBase',
		autopopulate: false,
		required: true
	},
	issue: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Issue',
		autopopulate: true,
		required: true
	},
	repairSteps: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'RepairStep',
		autopopulate: {options:{sort:{'step':1}}},
		required: false
	}]
},{timestamps: true});
RepairSchema.plugin(require('mongoose-autopopulate'));
RepairSchema.pre('save', function(next) {
	if (!this.isNew) return next();
	KnowledgeBase.findByIdAndUpdate(this.knowledgeBase,{ $push: { repair: this._id } },function(err,succ){
		if (err) {
			console.log(err);
		} else {
			console.log(succ);
		}
	});
	next();
});
module.exports = mongoose.model('Repair', RepairSchema);
