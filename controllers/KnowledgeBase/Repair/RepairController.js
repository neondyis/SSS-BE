const Repair = require('../../../models/KnowledgeBase/Repair/RepairModel.js');
const { body,validationResult } = require('express-validator');
const { check } = require('express-validator');
const apiResponse = require('../../../helpers/apiResponse.js');
const auth = require('../../../middlewares/jwt.js');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// Repair Schema
function RepairData(data) {
	this.id = data._id;
	this.issue = data.issue;
	this.knowledgeBase = data.knowledgeBase;
	this.repairSteps = data.repairSteps;
}

/**
 * Repair List.
 *
 * @returns {Object}
 */
exports.repairList = [
	auth,
	function (req, res) {
		try {
			Repair.find({},'_id issue -knowledgeBase repairSteps').then((repairs)=>{
				if(repairs.length > 0){
					return apiResponse.successResponseWithData(res, 'Operation success', repairs);
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
 * Repair Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.repairDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, 'Operation success', {});
		}
		try {
			Repair.findOne({_id: req.params.id},'_id issue -knowledgeBase repairSteps').then((repair)=>{
				if(repair !== null){
					let repairData = new RepairData(repair);
					return apiResponse.successResponseWithData(res, 'Operation success', repairData);
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
 * Repair store.
 * @param {string}      issue
 * @param {string}      knowledgeBase
 *
 * @returns {Object}
 */
exports.repairStore = [
	auth,
	body('issue', 'Content must not be empty.').isLength({ min: 1 }).trim(),
	body('knowledgeBase', 'Knowledge Base must not be empty').isLength({ min: 1 }).isAlphanumeric().trim()
	// .custom((value,{req}) => {
	// 	return Repair.findOne({knowledgeBase : value}).then(repair => {
	// 		if (repair) {
	// 			return Promise.reject('Repair already exist with this ISBN no.');
	// 		}
	// 	});
	// }),
	,
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const repair = new Repair(
				{
					issue: req.body.issue,
					knowledgeBase: req.body.knowledgeBase
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				//Save repair.
				repair.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let repairData = new RepairData(repair);
					return apiResponse.successResponseWithData(res,'Repair add Success.', repairData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

//TODO add check for updating or storing repair and prob other parts of knowledge

/**
 * Repair update.
 *
 * @param {string}      knowledgeBase
 * @param {string}      issue
 *
 * @returns {Object}
 */
exports.repairUpdate = [
	auth,
	body('issue', 'Issue must not be empty.').isLength({ min: 1 }).trim(),
	body('knowledgeBase', 'Knowledge Base must not be empty').isLength({ min: 1 }).isAlphanumeric().trim()
	// .custom((value,{req}) => {
	// 	return Repair.findOne({isbn : value,user: req.user._id, _id: { '$ne': req.params.id }}).then(repair => {
	// 		if (repair) {
	// 			return Promise.reject('Repair already exist with this ISBN no.');
	// 		}
	// 	});
	// }),
	,
	// TODO add handling of new repair steps here in update
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const repair =
				{
					issue: req.body.issue,
					knowledgeBase: req.body.knowledgeBase
				};

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
				}else{
					Repair.findById(req.params.id, function (err, foundRepair) {
						if(foundRepair === null){
							return apiResponse.notFoundResponse(res,'Repair not exists with this id');
						}else{
							//Check authorized user
							if(req.user.role !== 0 && req.user.role !== 1){
								return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
							}else{
								//update repair.
								Repair.findByIdAndUpdate(req.params.id, repair, {},function (err) {
									if (err) {
										return apiResponse.ErrorResponse(res, err);
									}else{
										let repairData = new RepairData(repair);
										return apiResponse.successResponseWithData(res,'Repair update Success.', repairData);
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
 * Repair Delete.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.repairDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
		}
		try {
			Repair.findById(req.params.id, function (err, foundRepair) {
				if(foundRepair === null){
					return apiResponse.notFoundResponse(res,'Repair not exists with this id');
				}else{
					//Check authorized user
					if(req.user.role !== 0 && req.user.role !== 1){
						return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
					}else{
						//delete repair.
						Repair.findByIdAndRemove(req.params.id,function (err) {
							if (err) {
								return apiResponse.ErrorResponse(res, err);
							}else{
								return apiResponse.successResponse(res,'Repair delete Success.');
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

exports.calculateRepairs = [
	auth,
	body('issues', 'Issues must not be empty.').isArray().isLength({min: 1}).trim(),
	function (req, res) {
		try {
			console.log(req.body)
			Repair.find({issue: {$in:req.body.issues}}, function (err, foundRepairs) {
				if(foundRepairs === null){
					return apiResponse.notFoundResponse(res,'No Repairs found for issues provided.');
				}else{
					console.log(foundRepairs)
					return apiResponse.successResponseWithData(res,'Success Repairs found for issue(s).',foundRepairs);
				}
			});
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
