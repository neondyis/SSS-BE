const mongoose = require('mongoose');
const Vacuum = mongoose.models['Vacuum'];
const Service = require('../../models/Service/ServiceModel.js');
const KnowledgeBase = require('../../models/KnowledgeBase/KnowledgeBaseModel.js');
const { body,validationResult } = require('express-validator');
const { check } = require('express-validator');
const apiResponse = require('../../helpers/apiResponse.js');
const auth = require('../../middlewares/jwt.js');

mongoose.set('useFindAndModify', false);

// Service Schema
function ServiceData(data) {
	this.id = data._id;
	this.vacuum = data.vacuum;
	this.user = data.user;
	this.status = data.status;
	this.knowledgeBase = data.knowledgeBase;
}

/**
 * Service List of user.
 *
 * @returns {Object}
 */
exports.serviceList = [
	auth,
	function (req, res) {
		try {
			Service.find({user: req.user._id},'_id vacuum user status knowledgeBase').then((services)=>{
				if(services.length > 0){
					return apiResponse.successResponseWithData(res, 'Operation success', services);
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
 * Service Detail.
 *
 * @param {string} id
 *
 * @returns {Object}
 */
exports.serviceDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.ErrorResponse(res, 'Invalid ID', {});
		}
		try {
			Service.findOne({vacuum: req.params.id},'_id vacuum user status knowledgeBase').then((service)=>{
				if(service !== null){
					let serviceData = new ServiceData(service);
					return apiResponse.successResponseWithData(res, 'Operation success', serviceData);
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
 * Service store.
 * @param {string}      vacuum
 * @param {string}      status
 * @param {string}      knowledgeBase
 *
 * @returns {Object}
 */
exports.serviceStore = [
	auth,
	body('status', 'Status must not be empty').isLength({ min: 1 }).trim(),
	body('vacuum', 'Vacuum must not be empty.').isLength({ min: 1 }).trim()
		.custom((value,{req}) => {
			return Service.findOne({vacuum : value}).then(service => {
				if (service) {
					return Promise.reject('Vacuum already exist in service.');
				}
			});
		}),
	check('*').escape(),
	async (req, res) => {
		try {
			const errors = validationResult(req);
			let kbId = null;
			await Vacuum.findOne({_id:req.body.vacuum}).then(async vacuum => {
				if(vacuum.model){
					await KnowledgeBase.findOne({productType:vacuum.type}, '+_id').then(knowledgeBase => {
						if(knowledgeBase !== null) {
							kbId = knowledgeBase._id;
						}
					});
				}else{
					await KnowledgeBase.findOne({productType:vacuum.type, productModel:vacuum.model},'+_id').then(knowledgeBase => {
						if(knowledgeBase !== null) {
							kbId = knowledgeBase._id;
						}
					});
				}
			});
			if(kbId === null){
				return apiResponse.notFoundResponse(res,'No KnowledgeBase found for this vacuum.');
			}
			const service = new Service(
				{
					vacuum: req.body.vacuum,
					user: req.user,
					knowledgeBase: kbId,
					status: req.body.status,
				});
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				//Save service.
				service.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let serviceData = new ServiceData(service);
					return apiResponse.successResponseWithData(res,'Service add Success.', serviceData);
				});
			}
		} catch (err) {
			console.log(err)
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Service update.
 *
 * @param {string}      vacuum
 * @param {string}      status
 * @param {string}      knowledgeBase
 *
 * @returns {Object}
 */
exports.serviceUpdate = [
	auth,
	body('status', 'Status must not be empty').isLength({ min: 1 }).trim(),
	body('vacuum', 'Vacuum must not be empty.').isLength({ min: 1 }).trim()
		.custom((value,{req}) => {
			return Service.findOne({vacuum : value,}).then(service => {
				if (service && service.status === 'In Progress') {
					return Promise.reject('Vacuum already exist with a service in progress.');
				}
			});
		}),
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const service =
				{
					vacuum: req.body.vacuum,
					user: req.user,
					status: req.body.status,
				};

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
				}else{
					Service.findById(req.params.id, function (err, foundService) {
						if(foundService === null){
							return apiResponse.notFoundResponse(res,'Service does not exists with this id');
						}else{
							//Check authorized user for worker or admin role
							if(req.user.role !== 0 && req.user.role !== 1){
								return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
							}else{
								//update service.
								Service.findByIdAndUpdate(req.params.id, service, {},function (err) {
									if (err) {
										return apiResponse.ErrorResponse(res, err);
									}else{
										let serviceData = new ServiceData(service);
										return apiResponse.successResponseWithData(res,'Service update Success.', serviceData);
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
 * Service Delete.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.serviceDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
		}
		try {
			Service.findById(req.params.id, function (err, foundService) {
				if(foundService === null){
					return apiResponse.notFoundResponse(res,'Service not exists with this id');
				}else{
					//Check authorized user
					if(req.user.role !== 0 && req.user.role !== 1){
						return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
					}else{
						//delete service.
						Service.findByIdAndRemove(req.params.id,function (err) {
							if (err) {
								return apiResponse.ErrorResponse(res, err);
							}else{
								return apiResponse.successResponse(res,'Service delete Success.');
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
