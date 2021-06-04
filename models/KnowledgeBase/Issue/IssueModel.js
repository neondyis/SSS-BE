const mongoose = require('mongoose');
const Diagnose = require('../Diagnose/DiagnoseModel.js');
const Part = require('./PartModel.js');
Part.findOne();

const IssueSchema = new mongoose.Schema({
	description:  {type: String, required: true},
	part: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Part',
		autopopulate: true,
		required: false,
	},
	diagnose: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Diagnose',
		autopopulate: false,
		required: true
	}
},{timestamps: true});
IssueSchema.plugin(require('mongoose-autopopulate'));

IssueSchema.pre('save', function(next) {
	if (!this.isNew) return next();
	Diagnose.findByIdAndUpdate(this.diagnose,{ $push: { issues: this._id } },function(err,succ){
		if (err) {
			console.log(err);
		} else {
			console.log(succ);
		}
	});
	next();
});


module.exports = mongoose.model('Issue', IssueSchema);
