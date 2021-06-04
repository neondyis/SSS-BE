const History = require('../models/HistoryModel');
const Passport = require('../models/PassportModel.js');
const { body,validationResult } = require('express-validator');
const { check } = require('express-validator');
const apiResponse = require('../helpers/apiResponse');
const auth = require('../middlewares/jwt');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// History Schema
function HistoryData(data) {
	this.id = data._id;
	this.passport = data.passport;
	this.content = data.content;
}

/**
 * History List.
 *
 * @returns {Object}
 */
exports.HistoryList = [
	auth,
	function (req, res) {
		try {
			History.find({user: req.user._id},'_id title description isbn createdAt').then((Historys)=>{
				if(Historys.length > 0){
					return apiResponse.successResponseWithData(res, 'Operation success', Historys);
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
 * History Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.HistoryDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, 'Operation success', {});
		}
		try {
			History.findOne({_id: req.params.id,user: req.user._id},'_id title description isbn createdAt').then((history)=>{
				if(history !== null){
					let historyData = new HistoryData(history);
					return apiResponse.successResponseWithData(res, 'Operation success', historyData);
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
 * History store.
 *
 * @param {string}  content
 * @param {string}  id
 *
 * @returns {Object}
 */
exports.HistoryStore = [
	auth,
	body('content', 'Content must not be empty.').isLength({ min: 1 }).trim()
		.custom((value,{req}) => {
			return History.findOne({passport: req.body.passport}).then(history => {
				if (history) {
					return Promise.reject('History already exist with this ISBN no.');
				}
			});
		}),
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const history = new History(
				{
					Content: req.body.title,
					Passport: req.body.passport,
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				//Save History.
				History.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let historyData = new HistoryData(history);
					return apiResponse.successResponseWithData(res,'History add Success.', historyData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * History update.
 *
 * @param {string}      content
 * @param {string}      passport
 *
 * @returns {Object}
 */
exports.HistoryUpdate = [
	auth,
	body('content', 'Content must not be empty.').isLength({ min: 1 }).trim(),
	body('passport', 'Passport must not be empty.').isLength({ min: 1 }).trim()
		.custom((value,{req}) => {
			return Passport.findOne({_id : req.body.passport}).then(passport => {
				if (passport) {
					return Promise.reject('Passport does not exist.');
				}
			});
		}),
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const history = new History(
				{
					Content: req.body.title,
					Passport: req.body.passport,
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
				}else{
					History.findById(req.params.id, function (err, foundHistory) {
						if(foundHistory === null){
							return apiResponse.notFoundResponse(res,'History does not exists with this id');
						}else{
							//Check authorized user
							if(req.user.role !== 0 && req.user.role !== 1){
								return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
							}else{
								//update History.
								History.findByIdAndUpdate(req.params.id, history, {},function (err) {
									if (err) {
										return apiResponse.ErrorResponse(res, err);
									}else{
										let historyData = new HistoryData(history);
										return apiResponse.successResponseWithData(res,'History update Success.', historyData);
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
 * History Delete.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.HistoryDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
		}
		try {
			History.findById(req.params.id, function (err, foundHistory) {
				if(foundHistory === null){
					return apiResponse.notFoundResponse(res,'History not exists with this id');
				}else{
					//Check authorized user
					if(req.user.role !== 0 && req.user.role !== 1){
						return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
					}else{
						//delete History.
						History.findByIdAndRemove(req.params.id,function (err) {
							if (err) {
								return apiResponse.ErrorResponse(res, err);
							}else{
								return apiResponse.successResponse(res,'History delete Success.');
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
