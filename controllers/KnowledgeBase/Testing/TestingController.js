const Test = require('../../../models/KnowledgeBase/Testing/TestingModel.js');
require('../../../models/KnowledgeBase/Testing/StageTestModel.js');
const { body,validationResult } = require('express-validator');
const { check } = require('express-validator');
const apiResponse = require('../../../helpers/apiResponse.js');
const auth = require('../../../middlewares/jwt.js');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// Test Schema
function TestData(data) {
	this.id = data._id;
	this.stageTest = data.stageTest;
}

// TODO Make controller functions for stage test and stage test content


/**
 * Test List.
 *
 * @returns {Object}
 */
exports.testList = [
	auth,
	function (req, res) {
		try {
			Test.find({},'_id stageTest -knowledgeBase').then((tests)=>{
				if(tests.length > 0){
					return apiResponse.successResponseWithData(res, 'Operation success', tests);
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
 * Test Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.testDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, 'Operation success', {});
		}
		try {
			Test.findOne({_id: req.params.id},'_id stageTest -knowledgeBase').then((test)=>{
				if(test !== null){
					let testData = new TestData(test);
					return apiResponse.successResponseWithData(res, 'Operation success', testData);
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

exports.vacuumSpecific = [
	auth,
	function (req, res) {

	}
];

/**
 * Test store.
 * @param []      		stageTest
 * @param {string}      knowledgeBase
 *
 * @returns {Object}
 */
exports.testStore = [
	auth,
	body('knowledgeBase', 'Knowledge Base must not be empty').isLength({ min: 1 }).isAlphanumeric().trim()
	// .custom((value,{req}) => {
	// 	return Test.findOne({knowledgeBase : value}).then(testing => {
	// 		if (test) {
	// 			return Promise.reject('Test already exist with this ISBN no.');
	// 		}
	// 	});
	// }),
	,
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const test = req.body.stageTest ? new Test(
				{
					stageTest: req.body.stageTest,
					knowledgeBase: req.body.knowledgeBase,
				}) : new Test(
				{
					knowledgeBase: req.body.knowledgeBase,
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				//Save test.
				test.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let testData = new TestData(test);
					return apiResponse.successResponseWithData(res,'Test add Success.', testData);
				});
			}
		} catch (err) {
			console.log(err)
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

//TODO add check for updating or storing test and prob other parts of knowledge

/**
 * Test update.
 *
 * @param {string}      stageTest
 * @param {string}      knowledgeBase
 *
 * @returns {Object}
 */
exports.testUpdate = [
	auth,
	body('knowledgeBase', 'Knowledge Base must not be empty').isLength({ min: 1 }).isAlphanumeric().trim()
	// .custom((value,{req}) => {
	// 	return Test.findOne({isbn : value,user: req.user._id, _id: { '$ne': req.params.id }}).then(test => {
	// 		if (test) {
	// 			return Promise.reject('Test already exist with this ISBN no.');
	// 		}
	// 	});
	// }),
	,
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const test = req.body.stageTest ?
				{
					stageTest: req.body.stageTest,
					knowledgeBase: req.body.knowledgeBase,
				}: {
					knowledgeBase: req.body.knowledgeBase,
				};

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
				}else{
					Test.findById(req.params.id, function (err, foundTest) {
						if(foundTest === null){
							return apiResponse.notFoundResponse(res,'Test not exists with this id');
						}else{
							//Check authorized user
							if(req.user.role !== 0 && req.user.role !== 1){
								return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
							}else{
								//update test.
								Test.findByIdAndUpdate(req.params.id, test, {},function (err) {
									if (err) {
										return apiResponse.ErrorResponse(res, err);
									}else{
										let testData = new TestData(test);
										return apiResponse.successResponseWithData(res,'Test update Success.', testData);
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
 * Test Delete.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.testDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
		}
		try {
			Test.findById(req.params.id, function (err, foundTest) {
				if(foundTest === null){
					return apiResponse.notFoundResponse(res,'Test not exists with this id');
				}else{
					//Check authorized user
					if(req.user.role !== 0 && req.user.role !== 1){
						return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
					}else{
						//delete test.
						Test.findByIdAndRemove(req.params.id,function (err) {
							if (err) {
								return apiResponse.ErrorResponse(res, err);
							}else{
								return apiResponse.successResponse(res,'Test delete Success.');
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
