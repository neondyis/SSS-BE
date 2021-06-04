const Diagnose = require('../../../models/KnowledgeBase/Diagnose/DiagnoseModel.js');
const { body,validationResult } = require('express-validator');
const { check } = require('express-validator');
const apiResponse = require('../../../helpers/apiResponse.js');
const auth = require('../../../middlewares/jwt.js');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// Diagnose Schema
function DiagnoseData(data) {
	this.id = data._id;
	this.issues = data.issues;
}

/**
 * Diagnose List.
 *
 * @returns {Object}
 */
exports.diagnoseList = [
	auth,
	function (req, res) {
		try {
			Diagnose.find({},'_id issues -knowledgeBase').then((diagnoses)=>{
				if(diagnoses.length > 0){
					return apiResponse.successResponseWithData(res, 'Operation success', diagnoses);
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
 * Diagnose Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.diagnoseDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, 'Operation success', {});
		}
		try {
			Diagnose.findOne({_id: req.params.id},'_id issues -knowledgeBase').then((diagnose)=>{
				if(diagnose !== null){
					let diagnoseData = new DiagnoseData(diagnose);
					return apiResponse.successResponseWithData(res, 'Operation success', diagnoseData);
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
 * Diagnose store.
 * @param {string}      knowledgeBase
 *
 * @returns {Object}
 */
exports.diagnoseStore = [
	auth,
	body('knowledgeBase', 'Knowledge Base must not be empty').isLength({ min: 1 }).isAlphanumeric().trim()
	// .custom((value,{req}) => {
	// 	return Diagnose.findOne({knowledgeBase : value}).then(diagnose => {
	// 		if (diagnose) {
	// 			return Promise.reject('Diagnose already exist with this ISBN no.');
	// 		}
	// 	});
	// }),
	,
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const diagnose = new Diagnose(
				{
					knowledgeBase: req.body.knowledgeBase,
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				//Save diagnose.
				diagnose.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let diagnoseData = new DiagnoseData(diagnose);
					return apiResponse.successResponseWithData(res,'Diagnose add Success.', diagnoseData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

//TODO add check for updating or storing diagnose and prob other parts of knowledge

/**
 * Diagnose update.
 *
 * @param {Array}      issues
 * @param {string}      knowledgeBase
 *
 * @returns {Object}
 */
exports.diagnoseUpdate = [
	auth,
	body('knowledgeBase', 'Knowledge Base must not be empty').isLength({ min: 1 }).isAlphanumeric().trim()
	// .custom((value,{req}) => {
	// 	return Diagnose.findOne({isbn : value,user: req.user._id, _id: { '$ne': req.params.id }}).then(diagnose => {
	// 		if (diagnose) {
	// 			return Promise.reject('Diagnose already exist with this ISBN no.');
	// 		}
	// 	});
	// }),
	,
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const diagnose =
				{
					issues: req.body.issues,
					knowledgeBase: req.body.knowledgeBase,
				};

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
				}else{
					Diagnose.findById(req.params.id, function (err, foundDiagnose) {
						if(foundDiagnose === null){
							return apiResponse.notFoundResponse(res,'Diagnose not exists with this id');
						}else{
							//Check authorized user
							if(req.user.role !== 0 && req.user.role !== 1){
								return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
							}else{
								//update diagnose.
								Diagnose.findByIdAndUpdate(req.params.id, diagnose, {},function (err) {
									if (err) {
										return apiResponse.ErrorResponse(res, err);
									}else{
										let diagnoseData = new DiagnoseData(diagnose);
										return apiResponse.successResponseWithData(res,'Diagnose update Success.', diagnoseData);
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
 * Diagnose Delete.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.diagnoseDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
		}
		try {
			Diagnose.findById(req.params.id, function (err, foundDiagnose) {
				if(foundDiagnose === null){
					return apiResponse.notFoundResponse(res,'Diagnose not exists with this id');
				}else{
					//Check authorized user
					if(req.user.role !== 0 && req.user.role !== 1){
						return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
					}else{
						//delete diagnose.
						Diagnose.findByIdAndRemove(req.params.id,function (err) {
							if (err) {
								return apiResponse.ErrorResponse(res, err);
							}else{
								return apiResponse.successResponse(res,'Diagnose delete Success.');
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
