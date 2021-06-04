const mongoose = require('mongoose');
const Test = require('./TestingModel.js');

const StageTestSchema = new mongoose.Schema({
	content: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'StageTestContent',
		autopopulate: true,
		required: false
	}],
	name : {type: String, required: true},
	description : {type: String, required: true},
	test: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Test',
		autopopulate: true,
		required: true
	}
},{timestamps: true});
StageTestSchema.plugin(require('mongoose-autopopulate'));

StageTestSchema.pre('save', function(next) {
	if (!this.isNew) return next();
	Test.findByIdAndUpdate(this.test,{ $push: { stage: this._id } },function(err,succ){
		if (err) {
			console.log(err);
		} else {
			console.log(succ);
		}
	});
	next();
});

module.exports = mongoose.model('StageTest', StageTestSchema);
