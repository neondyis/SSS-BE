const RepairStep = require('../../../models/KnowledgeBase/Repair/RepairStepModel.js');
const { body,validationResult } = require('express-validator');
const { check } = require('express-validator');
const apiResponse = require('../../../helpers/apiResponse.js');
const auth = require('../../../middlewares/jwt.js');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// RepairStep Schema
function RepairStepData(data) {
	this.id = data._id;
	this.repair = data.repair;
	this.step = data.step;
	this.content = data.content;
}

/**
 * RepairStep List.
 *
 * @returns {Object}
 */
exports.repairStepList = [
	auth,
	function (req, res) {
		try {
			RepairStep.find({},'_id step content').then((repairSteps)=>{
				if(repairSteps.length > 0){
					return apiResponse.successResponseWithData(res, 'Operation success', repairSteps);
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
 * RepairStep Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.repairStepDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, 'Operation success', {});
		}
		try {
			RepairStep.findOne({_id: req.params.id},'_id step content').then((repairStep)=>{
				if(repairStep !== null){
					let repairStepData = new RepairStepData(repairStep);
					return apiResponse.successResponseWithData(res, 'Operation success', repairStepData);
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
 * RepairStep store.
 * @param {string}      repair
 * @param {string}      content
 * @param {number}      step
 *
 * @returns {Object}
 */
exports.repairStepStore = [
	auth,
	body('repair', 'Repair must not be empty.').isLength({ min: 1 }).trim(),
	body('step', 'Step Base must not be empty').isLength({ min: 1 }).isNumeric(),
	body('content', 'Content Base must not be empty').isLength({ min: 1 }).isString().trim()
	// .custom((value,{req}) => {
	// 	return RepairStep.findOne({knowledgeBase : value}).then(repairStep => {
	// 		if (repairStep) {
	// 			return Promise.reject('RepairStep already exist with this ISBN no.');
	// 		}
	// 	});
	// }),
	,
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const repairStep = new RepairStep(
				{
					repair: req.body.repair,
					step: req.body.step,
					content:req.body.content
				});
			console.log('Test',repairStep)
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				//Save repairStep.
				repairStep.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let repairStepData = new RepairStepData(repairStep);
					return apiResponse.successResponseWithData(res,'RepairStep add Success.', repairStepData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

//TODO add check for updating or storing repairStep and prob other parts of knowledge

/**
 * RepairStep update.
 *
 * @param {string}      repair
 * @param {string}      content
 * @param {number}      step
 *
 * @returns {Object}
 */
exports.repairStepUpdate = [
	auth,
	body('repair', 'Repair must not be empty.').isLength({ min: 1 }).trim(),
	body('step', 'Step Base must not be empty').isLength({ min: 1 }).isNumeric(),
	body('content', 'Content Base must not be empty').isLength({ min: 1 }).isAlphanumeric().trim()
	// .custom((value,{req}) => {
	// 	return RepairStep.findOne({isbn : value,user: req.user._id, _id: { '$ne': req.params.id }}).then(repairStep => {
	// 		if (repairStep) {
	// 			return Promise.reject('RepairStep already exist with this ISBN no.');
	// 		}
	// 	});
	// }),
	,
	// TODO add handling of new repairStep steps here in update
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const repairStep =
				{
					repair: req.body.repair,
					step: req.body.step,
					content:req.body.content
				};

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
				}else{
					RepairStep.findById(req.params.id, function (err, foundRepairStep) {
						if(foundRepairStep === null){
							return apiResponse.notFoundResponse(res,'RepairStep not exists with this id');
						}else{
							//Check authorized user
							if(req.user.role !== 0 && req.user.role !== 1){
								return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
							}else{
								//update repairStep.
								RepairStep.findByIdAndUpdate(req.params.id, repairStep, {},function (err) {
									if (err) {
										return apiResponse.ErrorResponse(res, err);
									}else{
										let repairStepData = new RepairStepData(repairStep);
										return apiResponse.successResponseWithData(res,'RepairStep update Success.', repairStepData);
									}
								});
							}
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * RepairStep Delete.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.repairStepDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
		}
		try {
			RepairStep.findById(req.params.id, function (err, foundRepairStep) {
				if(foundRepairStep === null){
					return apiResponse.notFoundResponse(res,'RepairStep not exists with this id');
				}else{
					//Check authorized user
					if(req.user.role !== 0 && req.user.role !== 1){
						return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
					}else{
						//delete repairStep.
						RepairStep.findByIdAndRemove(req.params.id,function (err) {
							if (err) {
								return apiResponse.ErrorResponse(res, err);
							}else{
								return apiResponse.successResponse(res,'RepairStep delete Success.');
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
