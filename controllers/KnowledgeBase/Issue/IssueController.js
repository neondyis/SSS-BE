const Issue = require('../../../models/KnowledgeBase/Issue/IssueModel.js');
const { body,validationResult } = require('express-validator');
const { check } = require('express-validator');
const apiResponse = require('../../../helpers/apiResponse.js');
const auth = require('../../../middlewares/jwt.js');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// Issue Schema
function IssueData(data) {
	this.id = data._id;
	this.description = data.description;
	this.part = data.part;
	this.diagnose = data.diagnose;
}

/**
 * Issue List.
 *
 * @returns {Object}
 */
exports.issueList = [
	auth,
	function (req, res) {
		try {
			Issue.find({},'_id description part ').then((issues)=>{
				if(issues.length > 0){
					return apiResponse.successResponseWithData(res, 'Operation success', issues);
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
 * Issue Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.issueDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, 'Operation success', {});
		}
		try {
			Issue.findOne({_id: req.params.id},'_id description part').then((issue)=>{
				if(issue !== null){
					let issueData = new IssueData(issue);
					return apiResponse.successResponseWithData(res, 'Operation success', issueData);
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
 * Issue store.
 * @param {string}      description
 * @param {string}      part
 *
 * @returns {Object}
 */
exports.issueStore = [
	auth,
	body('description', 'Description must not be empty.').isLength({ min: 1 }).trim(),
	body('part', 'Part must not be empty.').isLength({ min: 1 }).trim(),
	body('diagnose', 'Diagnose Base must not be empty').isLength({ min: 1 }).isAlphanumeric().trim()
	// .custom((value,{req}) => {
	// 	return Issue.findOne({knowledgeBase : value}).then(issue => {
	// 		if (issue) {
	// 			return Promise.reject('Issue already exist with this ISBN no.');
	// 		}
	// 	});
	// }),
	,
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const issue = new Issue(
				{
					part: req.body.part,
					description: req.body.description,
					diagnose: req.body.diagnose
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				//Save issue.
				issue.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let issueData = new IssueData(issue);
					return apiResponse.successResponseWithData(res,'Issue add Success.', issueData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

//TODO add check for updating or storing issue and prob other parts of knowledge

/**
 * Issue update.
 *
 * @param {string}      description
 * @param {string}      part
 * @param {string}      diagnose
 *
 * @returns {Object}
 */
exports.issueUpdate = [
	auth,
	body('description', 'Description must not be empty.').isLength({ min: 1 }).trim(),
	body('part', 'Part must not be empty.').isLength({ min: 1 }).trim(),
	body('diagnose', 'Diagnose Base must not be empty').isLength({ min: 1 }).isAlphanumeric().trim()
	// .custom((value,{req}) => {
	// 	return Issue.findOne({isbn : value,user: req.user._id, _id: { '$ne': req.params.id }}).then(issue => {
	// 		if (issue) {
	// 			return Promise.reject('Issue already exist with this ISBN no.');
	// 		}
	// 	});
	// }),
	,
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const issue =
				{
					part: req.body.part,
					description: req.body.description,
					diagnose: req.body.diagnose
				};

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
				}else{
					Issue.findById(req.params.id, function (err, foundIssue) {
						if(foundIssue === null){
							return apiResponse.notFoundResponse(res,'Issue not exists with this id');
						}else{
							//Check authorized user
							if(req.user.role !== 0 && req.user.role !== 1){
								return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
							}else{
								//update issue.
								Issue.findByIdAndUpdate(req.params.id, issue, {},function (err) {
									if (err) {
										return apiResponse.ErrorResponse(res, err);
									}else{
										let issueData = new IssueData(issue);
										return apiResponse.successResponseWithData(res,'Issue update Success.', issueData);
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
 * Issue Delete.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.issueDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
		}
		try {
			Issue.findById(req.params.id, function (err, foundIssue) {
				if(foundIssue === null){
					return apiResponse.notFoundResponse(res,'Issue not exists with this id');
				}else{
					//Check authorized user
					if(req.user.role !== 0 && req.user.role !== 1){
						return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
					}else{
						//delete issue.
						Issue.findByIdAndRemove(req.params.id,function (err) {
							if (err) {
								return apiResponse.ErrorResponse(res, err);
							}else{
								return apiResponse.successResponse(res,'Issue delete Success.');
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
