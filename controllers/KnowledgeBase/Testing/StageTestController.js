const StageTest = require('../../../models/KnowledgeBase/Testing/StageTestModel.js');
const StageTestContent = require('../../../models/KnowledgeBase/Testing/StageTestStepModel.js');
const {body, validationResult} = require('express-validator');
const {check} = require('express-validator');
const apiResponse = require('../../../helpers/apiResponse.js');
const auth = require('../../../middlewares/jwt.js');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);


// StageTest Schema
function StageTestData(data) {
	this.id = data._id;
	this.name = data.name;
	this.description = data.description;
	this.test = data.test;
	this.content = data.content;
}

/**
 * StageTest List.
 *
 * @returns {Object}
 */
exports.stageTestList = [
	auth,
	function (req, res) {
		try {
			StageTest.find({}, '_id stage knowledgeBase').then((stageTests) => {
				if (stageTests.length > 0) {
					return apiResponse.successResponseWithData(res, 'Operation success', stageTests);
				} else {
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
 * StageTest Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.stageTestDetail = [
	auth,
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.successResponseWithData(res, 'Operation success', {});
		}
		try {
			StageTest.findOne({_id: req.params.id}, '_id stage knowledgeBase').then((stageTest) => {
				if (stageTest !== null) {
					let stageTestData = new StageTestData(stageTest);
					return apiResponse.successResponseWithData(res, 'Operation success', stageTestData);
				} else {
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
 * StageTest store.
 * @param {string}      content
 * @param {number}      step
 * @param {string}      knowledgeBase
 *
 * @returns {Object}
 */
exports.stageTestStore = [
	auth,
	body('stage', 'Content must not be empty.').isLength({min: 1}).trim(),
	body('knowledgeBase', 'Knowledge Base must not be empty').isLength({min: 1}).isAlphanumeric().trim()
	// .custom((value,{req}) => {
	// 	return StageTest.findOne({knowledgeBase : value}).then(stageTest => {
	// 		if (stageTest) {
	// 			return Promise.reject('StageTest already exist with this ISBN no.');
	// 		}
	// 	});
	// }),
	,
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const stageTest = new StageTest(
				{
					Content: [],
					Description: req.body.description,
					Test: req.body.test,
				});
			addContent(req.body.content,stageTest.Content,res);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			} else {
				//Save stageTest.
				stageTest.save(function (err) {
					if (err) {
						return apiResponse.ErrorResponse(res, err);
					}
					let stageTestData = new StageTestData(stageTest);
					return apiResponse.successResponseWithData(res, 'StageTest add Success.', stageTestData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

//TODO add check for updating or storing stageTest and prob other parts of knowledge

/**
 * StageTest update.
 *
 * @param {string}      content
 * @param {number}      step
 * @param {string}      knowledgeBase
 *
 * @returns {Object}
 */
exports.stageTestUpdate = [
	auth,
	body('description', 'Description must not be empty.').isLength({min: 1}).trim(),
	body('test','Test must not be empty.').isLength({min: 1}).trim()
	// .custom((value,{req}) => {
	// 	return StageTest.findOne({isbn : value,user: req.user._id, _id: { '$ne': req.params.id }}).then(stageTest => {
	// 		if (stageTest) {
	// 			return Promise.reject('StageTest already exist with this ISBN no.');
	// 		}
	// 	});
	// }),
	,
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const stageTest = new StageTest(
				{
					Content: [],
					Description: req.body.description,
					Test: req.body.test,
				});
			addContent(req.body.content,stageTest.Content,res);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			} else {
				if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
					return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
				} else {
					StageTest.findById(req.params.id, function (err, foundStageTest) {
						if (foundStageTest === null) {
							return apiResponse.notFoundResponse(res, 'StageTest not exists with this id');
						} else {
							//Check authorized user
							if (req.user.role !== 0 && req.user.role !== 1) {
								return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
							} else {
								//update stageTest.
								StageTest.findByIdAndUpdate(req.params.id, stageTest, {}, function (err) {
									if (err) {
										return apiResponse.ErrorResponse(res, err);
									} else {
										let stageTestData = new StageTestData(stageTest);
										return apiResponse.successResponseWithData(res, 'StageTest update Success.', stageTestData);
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
 * StageTest Delete.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.stageTestDelete = [
	auth,
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
		}
		try {
			StageTest.findById(req.params.id, function (err, foundStageTest) {
				if (foundStageTest === null) {
					return apiResponse.notFoundResponse(res, 'StageTest not exists with this id');
				} else {
					//Check authorized user
					if (req.user.role !== 0 && req.user.role !== 1) {
						return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
					} else {
						//delete stageTest.
						StageTest.findByIdAndRemove(req.params.id, function (err) {
							if (err) {
								return apiResponse.ErrorResponse(res, err);
							} else {
								return apiResponse.successResponse(res, 'StageTest delete Success.');
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

const addContent = (contentArray, stageArray,res) => {
	contentArray.forEach((data) => {
		new StageTestContent({
			Content: data.content,
			Stage: data.stage,
			Step: data.step,
		}.save(function (err, stageContent) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			}
			stageArray.push(stageContent._id);
		}
		));
	});
};
