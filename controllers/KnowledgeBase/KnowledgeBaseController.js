const KnowledgeBase = require('../../models/KnowledgeBase/KnowledgeBaseModel.js');
const { body,validationResult } = require('express-validator');
const { check } = require('express-validator');
const apiResponse = require('../../helpers/apiResponse.js');
const auth = require('../../middlewares/jwt.js');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// KnowledgeBase Schema
function KnowledgeBaseData(data) {
	this.id = data._id;
	this.productType= data.productType;
	this.productModel = data.productModel;
	this.disassemble = data.disassemble;
	this.diagnose = data.diagnose;
	this.repair = data.repair;
	this.test = data.test;
}

/**
 * KnowledgeBase List.
 *
 * @returns {Object}
 */
exports.knowledgeBaseList = [
	auth,
	function (req, res) {
		try {
			KnowledgeBase.find({},'_id productType productModel disassemble diagnose repair test').then((knowledgeBases)=>{
				if(knowledgeBases.length > 0){
					return apiResponse.successResponseWithData(res, 'Operation success', knowledgeBases);
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
 * KnowledgeBase Detail.
 *
 * @param {string} id
 *
 * @returns {Object}
 */
exports.knowledgeBaseDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, 'Operation success', {});
		}
		try {
			KnowledgeBase.findOne({_id: req.params.id},'_id  productType productModel disassemble diagnose repair test').then((knowledgeBase)=>{
				if(knowledgeBase !== null){
					let knowledgeBaseData = new KnowledgeBaseData(knowledgeBase);
					return apiResponse.successResponseWithData(res, 'Operation success', knowledgeBaseData);
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
 * KnowledgeBase store.
 * @param {string}  productType
 * @param {string}  productModel
 * @param {Array}   disassemble
 * @param {Array}   diagnose
 * @param {Array}   repair
 * @param {Array}   test
 * @returns {Object}
 */
exports.knowledgeBaseStore = [
	auth,
	body('productType', 'Product Type must not be empty.').isLength({ min: 1 }).trim(),
	body('productModel', 'Product Model must not be empty.').isLength({ min: 1 }).trim()
		.custom((value,{req}) => {
			return KnowledgeBase.findOne({productModel : value}).then(knowledgeBase => {
				if (knowledgeBase) {
					return Promise.reject('KnowledgeBase already exist with this Product Model.');
				}
			});
		}),
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const knowledgeBase = new KnowledgeBase(
				{
					productType: req.body.productType,
					productModel: req.body.productModel,
					disassemble : req.body.disassemble,
					diagnose : req.body.diagnose,
					repair : req.body.repair,
					test : req.body.test,
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				//Save knowledgeBase.
				knowledgeBase.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let knowledgeBaseData = new KnowledgeBaseData(knowledgeBase);
					return apiResponse.successResponseWithData(res,'KnowledgeBase add Success.', knowledgeBaseData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * KnowledgeBase update.
 *
 * @param {string}  productType
 * @param {string}  productModel
 * @param {Array}   disassemble
 * @param {Array}   diagnose
 * @param {Array}   repair
 * @param {Array}   test
 *
 * @returns {Object}
 */
exports.knowledgeBaseUpdate = [
	auth,
	body('productType', 'Product Type must not be empty.').isLength({ min: 1 }).trim(),
	body('productModel', 'Product Model must not be empty.').isLength({ min: 1 }).trim()
		.custom((value,{req}) => {
			return KnowledgeBase.findOne({productModel : value, _id: { '$ne': req.params.id }}).then(knowledgeBase => {
				if (knowledgeBase) {
					return Promise.reject('KnowledgeBase already exist with this ISBN no.');
				}
			});
		}),
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const knowledgeBase =
				{
					productType: req.body.productType,
					productModel: req.body.productModel,
					// disassemble : req.body.disassemble,
					// diagnose : req.body.diagnose,
					// repair : req.body.repair,
					// test : req.body.test,
				};

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
				}else{
					KnowledgeBase.findById(req.params.id, function (err, foundKnowledgeBase) {
						if(foundKnowledgeBase === null){
							return apiResponse.notFoundResponse(res,'KnowledgeBase not exists with this id');
						}else{
							//Check authorized user
							if(req.user.role !== 0 && req.user.role !== 1){
								return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
							}else{
								//update knowledgeBase.
								KnowledgeBase.findByIdAndUpdate(req.params.id, knowledgeBase, {},function (err) {
									if (err) {
										return apiResponse.ErrorResponse(res, err);
									}else{
										let knowledgeBaseData = new KnowledgeBaseData(knowledgeBase);
										return apiResponse.successResponseWithData(res,'KnowledgeBase update Success.', knowledgeBaseData);
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
 * KnowledgeBase Delete.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.knowledgeBaseDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
		}
		try {
			KnowledgeBase.findById(req.params.id, function (err, foundKnowledgeBase) {
				if(foundKnowledgeBase === null){
					return apiResponse.notFoundResponse(res,'KnowledgeBase not exists with this id');
				}else{
					//Check authorized user
					if(req.user.role !== 0 && req.user.role !== 1){
						return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
					}else{
						//delete knowledgeBase.
						KnowledgeBase.findByIdAndRemove(req.params.id,function (err) {
							if (err) {
								return apiResponse.ErrorResponse(res, err);
							}else{
								return apiResponse.successResponse(res,'KnowledgeBase delete Success.');
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
