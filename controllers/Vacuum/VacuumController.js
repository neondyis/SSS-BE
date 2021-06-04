const Vacuum = require('../../models/Vacuum/VacuumModel.js');
const { body,validationResult } = require('express-validator');
const { check } = require('express-validator');
const apiResponse = require('../../helpers/apiResponse.js');
const auth = require('../../middlewares/jwt.js');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// vacuum Schema
function VacuumData(data) {
	this.series= data.series;
	this.passport = data.passport;
	this.model = data.model;
	this.status = data.status;
	this.label = data.label;
	this.id = data._id;
	this.type = data.type;
}

/**
 * vacuum List.
 *
 * @returns {Object}
 */
exports.vacuumList = [
	auth,
	function (req, res) {
		try {
			Vacuum.find({},'_id series model passport model status type year').then((vacuums)=>{
				if(vacuums.length > 0){
					return apiResponse.successResponseWithData(res, 'Operation success', vacuums);
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
 * vacuum Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.vacuumDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, 'Operation success', {});
		}
		try {
			Vacuum.findOne({_id: req.params.id},'_id series model status passport model type year').then((vacuum)=>{
				if(vacuum !== null){
					let vacuumData = new VacuumData(vacuum);
					return apiResponse.successResponseWithData(res, 'Operation success', vacuumData);
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
 * vacuum store.
 *
 * @param {string}      series
 * @param {string}      model
 * @param {string}		status
 * @param {string}      type
 *
 * @returns {Object}
 */
exports.vacuumStore = [
	auth,
	body('series', 'Series must not be empty.').isLength({ min: 1 }).trim(),
	body('type', 'Type must not be empty').isLength({ min: 1 }).trim(),
	body('status', 'Status must not be empty').isLength({ min: 1 }).trim(),
	body('model', 'Model must not be empty.').isLength({ min: 1 }).trim()
	// .custom((value,{req}) => {
	// 	return Vacuum.findOne({model : value,user: req.user._id}).then(vacuum => {
	// 		if (vacuum) {
	// 			return Promise.reject('vacuum already exists with model no.');
	// 		}
	// 	});
	// }),
	,
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const vacuum = new Vacuum(
				{
					series: req.body.series,
					status: req.body.status,
					model: req.body.model,
					type: req.body.type,
				});
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				//Save vacuum.
				vacuum.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let vacuumData = new VacuumData(vacuum);
					return apiResponse.successResponseWithData(res,'vacuum add Success.', vacuumData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * vacuum update.
 *
 * @param {string}      series
 * @param {string}      model
 * @param {string}      status
 * @param {string}		label
 * @param {string}      type
 *
 * @returns {Object}
 */
exports.vacuumUpdate = [
	auth,
	body('series', 'Series must not be empty.').isLength({ min: 1 }).trim(),
	body('type', 'Type must not be empty').isLength({ min: 1 }).trim(),
	body('status', 'Status must not be empty').isLength({ min: 1 }).trim(),
	body('model', 'Model must not be empty.').isLength({ min: 1 }).trim(),
	// .custom((value,{req}) => {
	// 	return Vacuum.findOne({model : value, _id: { '$ne': req.params.id }}).then(vacuum => {
	// 		if (vacuum) {
	// 			return Promise.reject('vacuum already exist with this model no.');
	// 		}
	// 	});
	// }),
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const vacuum = req.body.passport ?
				{
					series: req.body.series,
					status: req.body.status,
					model: req.body.model,
					label: req.body.label,
					type: req.body.type,
					passport: req.body.passport
				} :
				{
					series: req.body.series,
					status: req.body.status,
					model: req.body.model,
					label: req.body.label,
					type: req.body.type,
				};
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
				}else{
					Vacuum.findById(req.params.id, function (err, foundVacuum) {
						if(foundVacuum === null){
							return apiResponse.notFoundResponse(res,'vacuum not exists with this id');
						}else{
							//Check authorized user
							if(req.user.role !== 0 && req.user.role !== 1){
								return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
							}else{
								//update vacuum.
								Vacuum.findByIdAndUpdate(req.params.id, vacuum, {new :true},function (err,newVacuum) {
									if (err) {
										return apiResponse.ErrorResponse(res, err);
									}else{
										let vacuumData = new VacuumData(newVacuum);
										return apiResponse.successResponseWithData(res,'vacuum update Success.', vacuumData);
									}
								});
							}
						}
					});
				}
			}
		} catch (err) {
			console.log(err);
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * vacuum Delete.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.vacuumDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
		}
		try {
			Vacuum.findById(req.params.id, function (err, foundVacuum) {
				if(foundVacuum === null){
					return apiResponse.notFoundResponse(res,'vacuum not exists with this id');
				}else{
					//Check authorized user
					if(req.user.role !== 0 && req.user.role !== 1){
						return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
					}else{
						//delete vacuum.
						Vacuum.findByIdAndRemove(req.params.id,function (err) {
							if (err) {
								return apiResponse.ErrorResponse(res, err);
							}else{
								return apiResponse.successResponse(res,'vacuum delete Success.');
							}
						});
					}
				}
			});
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
