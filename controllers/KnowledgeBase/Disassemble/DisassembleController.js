const Disassemble = require('../../../models/KnowledgeBase/Disassemble/DisassembleModel.js');
const { body,validationResult } = require('express-validator');
const { check } = require('express-validator');
const apiResponse = require('../../../helpers/apiResponse.js');
const auth = require('../../../middlewares/jwt.js');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// Disassemble Schema
function DisassembleData(data) {
	this.id = data._id;
	this.content= data.content;
	this.step = data.step;
}

/**
 * Disassemble List.
 *
 * @returns {Object}
 */
exports.disassembleList = [
	auth,
	function (req, res) {
		try {
			Disassemble.find({},'_id content step -knowledgeBase').then((disassembles)=>{
				if(disassembles.length > 0){
					return apiResponse.successResponseWithData(res, 'Operation success', disassembles);
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
 * Disassemble Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.disassembleDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, 'Operation success', {});
		}
		try {
			Disassemble.findOne({_id: req.params.id},'_id content step -knowledgeBase').then((disassemble)=>{
				if(disassemble !== null){
					let disassembleData = new DisassembleData(disassemble);
					return apiResponse.successResponseWithData(res, 'Operation success', disassembleData);
				}else{
					return apiResponse.successResponseWithData(res, 'Operation success', {});
				}
			});
		} catch (err) {
			console.log(err)
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Disassemble store.
 * @param {string}      content
 * @param {number}      step
 * @param {string}      knowledgeBase
 *
 * @returns {Object}
 */
exports.disassembleStore = [
	auth,
	body('content', 'Content must not be empty.').isLength({ min: 1 }).trim(),
	body('step', 'Step must not be empty.').isLength({ min: 1 }).trim(),
	body('knowledgeBase', 'Knowledge Base must not be empty').isLength({ min: 1 }).isAlphanumeric().trim()
	// .custom((value,{req}) => {
	// 	return Disassemble.findOne({knowledgeBase : value}).then(disassemble => {
	// 		if (disassemble) {
	// 			return Promise.reject('Disassemble already exist with this ISBN no.');
	// 		}
	// 	});
	// }),
	,
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const disassemble = new Disassemble(
				{
					content: req.body.content,
					step: req.body.step,
					knowledgeBase: req.body.knowledgeBase,
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				//Save disassemble.
				disassemble.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let disassembleData = new DisassembleData(disassemble);
					return apiResponse.successResponseWithData(res,'Disassemble add Success.', disassembleData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

//TODO add check for updating or storing disassemble and prob other parts of knowledge

/**
 * Disassemble update.
 *
 * @param {string}      content
 * @param {number}      step
 * @param {string}      knowledgeBase
 *
 * @returns {Object}
 */
exports.disassembleUpdate = [
	auth,
	body('content', 'Content must not be empty.').isLength({ min: 1 }).trim(),
	body('step', 'Step must not be empty.').isLength({ min: 1 }).trim(),
	body('knowledgeBase', 'Knowledge Base must not be empty').isLength({ min: 1 }).isAlphanumeric().trim()
	// .custom((value,{req}) => {
	// 	return Disassemble.findOne({isbn : value,user: req.user._id, _id: { '$ne': req.body.id }}).then(disassemble => {
	// 		if (disassemble) {
	// 			return Promise.reject('Disassemble already exist with this ISBN no.');
	// 		}
	// 	});
	// }),
	,
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const disassemble =
				{
					content: req.body.content,
					step: req.body.step,
					knowledgeBase: req.body.knowledgeBase,
				};

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
				}else{
					Disassemble.findById(req.params.id, function (err, foundDisassemble) {
						if(foundDisassemble === null){
							return apiResponse.notFoundResponse(res,'Disassemble not exists with this id');
						}else{
							//Check authorized user
							if(req.user.role !== 0 && req.user.role !== 1){
								return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
							}else{
								//update disassemble.
								Disassemble.findByIdAndUpdate(req.params.id, disassemble, {},function (err) {
									if (err) {
										return apiResponse.ErrorResponse(res, err);
									}else{
										let disassembleData = new DisassembleData(disassemble);
										return apiResponse.successResponseWithData(res,'Disassemble update Success.', disassembleData);
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
 * Disassemble Delete.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.disassembleDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
		}
		try {
			Disassemble.findById(req.params.id, function (err, foundDisassemble) {
				if(foundDisassemble === null){
					return apiResponse.notFoundResponse(res,'Disassemble not exists with this id');
				}else{
					//Check authorized user
					if(req.user.role !== 0 && req.user.role !== 1){
						return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
					}else{
						//delete disassemble.
						Disassemble.findByIdAndRemove(req.params.id,function (err) {
							if (err) {
								return apiResponse.ErrorResponse(res, err);
							}else{
								return apiResponse.successResponse(res,'Disassemble delete Success.');
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
