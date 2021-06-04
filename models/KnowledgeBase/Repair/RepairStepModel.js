const mongoose = require('mongoose');
const Repair = require('../Repair/RepairModel.js');

const RepairStepSchema = new mongoose.Schema({
	repair:  {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Repair',
		autopopulate: false,
		required: true
	},
	step: {
		type: Number,
		required: true
	},
	content: {
		type: String,
		required: true,
	},
},{timestamps: true});
RepairStepSchema.plugin(require('mongoose-autopopulate'));
RepairStepSchema.pre('save', function(next) {
	if (!this.isNew) return next();
	Repair.findByIdAndUpdate(this.repair,{ $push: { repairSteps: this._id } },function(err,succ){
		if (err) {
			console.log(err);
		} else {
			console.log(succ);
		}
	});
	next();
});
module.exports = mongoose.model('RepairStep', RepairStepSchema);
