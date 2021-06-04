const mongoose = require('mongoose');

const SeriesSchema = new mongoose.Schema({
	name: {type: String, required: true},
	brand: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Brand',
		autopopulate: true,
		required: true
	},
},{timestamps: true});
SeriesSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Series', SeriesSchema);
