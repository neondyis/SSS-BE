const Status = require('../../models/Vacuum/StatusModel.js');
const apiResponse = require('../../helpers/apiResponse.js');
const auth = require('../../middlewares/jwt.js');
const { body,validationResult } = require('express-validator');
const { check } = require('express-validator');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// Status Schema
function StatusData(data) {
	this.id = data._id;
	this.brand = data.brand;
	this.name= data.name;
}

/**
 * Status List.
 *
 * @returns {Object}
 */
exports.statusList = [
	auth,
	function (req, res) {
		try {
			Status.find({},'_id name brand').then((status)=>{
				if(status.length > 0){
					return apiResponse.successResponseWithData(res, 'Operation success', status);
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
 * Status Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.statusDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, 'Operation success', {});
		}
		try {
			Status.findOne({_id: req.params.id},'_id Name').then((status)=>{
				if(status !== null){
					let statusData = new StatusData(status);
					return apiResponse.successResponseWithData(res, 'Operation success', statusData);
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


/**
 * status store.
 *
 * @param {string}      name
 * @param {string}      color
 * @param {string}		description
 *
 * @returns {Object}
 */
exports.statusStore = [
	auth,
	body('name', 'Series must not be empty.').isLength({ min: 1 }).trim(),
	body('color', 'Type must not be empty').isLength({ min: 1 }).trim(),
	body('description', 'Status must not be empty').isLength({ min: 1 }).trim()
	// .custom((value,{req}) => {
	// 	return Vacuum.findOne({model : value,user: req.user._id}).then(status => {
	// 		if (status) {
	// 			return Promise.reject('status already exists with model no.');
	// 		}
	// 	});
	// }),
	,
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const status = new Status(
				{
					name: req.body.name,
					color: req.body.color,
					description: req.body.description,
				});
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				//Save status.
				status.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let statusData = new StatusData(status);
					return apiResponse.successResponseWithData(res,'status add Success.', statusData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];



