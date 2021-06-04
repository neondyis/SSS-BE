const mongoose = require('mongoose');
const StageTest = require('./StageTestModel.js');

const StageTestStepSchema = new mongoose.Schema({
	content: {type: String, required: true},
	stage: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'StageTest',
		autopopulate: true,
		required: true
	},
	step: {type: Number, required: true},
},{timestamps: true});
StageTestStepSchema.pre('save', function(next) {
	if (!this.isNew) return next();
	StageTest.findByIdAndUpdate(this.stage,{ $push: { stage: this._id } },function(err,succ){
		if (err) {
			console.log(err);
		} else {
			console.log(succ);
		}
	});
	next();
});
StageTestStepSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('StageTestStep', StageTestStepSchema);
