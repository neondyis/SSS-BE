const Label = require('../../models/Vacuum/LabelModel.js');
const apiResponse = require('../../helpers/apiResponse.js');
const auth = require('../../middlewares/jwt.js');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// Label Schema
function LabelData(data) {
	this.id = data._id;
	this.color = data.color;
	this.description = data.description;
	this.name= data.name;
}

/**
 * Label List.
 *
 * @returns {Object}
 */
exports.labelList = [
	auth,
	function (req, res) {
		try {
			Label.find({},'_id name color description').then((label)=>{
				if(label.length > 0){
					return apiResponse.successResponseWithData(res, 'Operation success', label);
				}else{
					return apiResponse.successResponseWithData(res, 'Operation success', []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Label Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.labelDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, 'Operation success', {});
		}
		try {
			Label.findOne({_id: req.params.id},'_id name color description').then((label)=>{
				if(label !== null){
					let labelData = new LabelData(label);
					return apiResponse.successResponseWithData(res, 'Operation success', labelData);
				}else{
					return apiResponse.successResponseWithData(res, 'Operation success', {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
