const Brand = require('../../models/Vacuum/BrandModel.js');
const { body,validationResult } = require('express-validator');
const { check } = require('express-validator');
const apiResponse = require('../../helpers/apiResponse.js');
const auth = require('../../middlewares/jwt.js');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// brand Schema
function BrandData(data) {
	this.id = data._id;
	this.name = data.name;
}

/**
 * Brand List.
 *
 * @returns {Object}
 */
exports.brandList = [
	auth,
	function (req, res) {
		try {
			Brand.find({},'_id name').then((brands)=>{
				if(brands.length > 0){
					return apiResponse.successResponseWithData(res, 'Operation success', brands);
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
 * brand Detail.
 *
 * @param {string} id
 *
 * @returns {Object}
 */
exports.brandDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.ErrorResponse(res, 'Invalid ID', {});
		}
		try {
			Brand.findOne({_id: req.params.id},'_id name').then((brand)=>{
				if(brand !== null){
					let brandData = new BrandData(brand);
					return apiResponse.successResponseWithData(res, 'Operation success', brandData);
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
 * brand store.
 *
 * @param {string}  name
 *
 * @returns {Object}
 */
exports.brandStore = [
	auth,
	body('name', 'Name must not be empty.').isLength({ min: 1 }).trim()
		.custom((value) => {
			return Brand.findOne({name : value}).then(series => {
				if (series) {
					return Promise.reject('Series already exist.');
				}
			});
		}),
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const brand = new Brand(
				{
					name: req.body.name
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				//Save series.
				brand.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let seriesData = new BrandData(brand);
					return apiResponse.successResponseWithData(res,'Series add success.', seriesData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * brand update.
 *
 * @param {string} name
 *
 * @returns {Object}
 */
exports.brandUpdate = [
	auth,
	body('name', 'Name must not be empty.').isLength({ min: 1 }).trim()
		.custom((value,{req}) => {
			return Brand.findOne({name : value, _id: { '$ne': req.params.id }}).then(brand => {
				if (brand) {
					return Promise.reject('Brand already exists.');
				}
			});
		}),
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const brand =
				{
					name: req.body.name,
				};
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
				}else{
					Brand.findById(req.params.id, function (err, foundBrand) {

						if(foundBrand === null){
							return apiResponse.notFoundResponse(res,'Brand not exists with this id');
						}else{
							//Check authorized user
							if(req.user.role !== 0 && req.user.role !== 1){
								return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
							}else{
								//update brand.
								Brand.findByIdAndUpdate(req.params.id, brand, {},function (err) {
									if (err) {
										return apiResponse.ErrorResponse(res, err);
									}else{
										let brandData = new BrandData(brand);
										return apiResponse.successResponseWithData(res,'Brand update Success.', brandData);
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
 * brand Delete.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.brandDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
		}
		try {
			Brand.findById(req.params.id, function (err, foundBrand) {
				if(foundBrand === null){
					return apiResponse.notFoundResponse(res,'brand not exists with this id');
				}else{
					//Check authorized user
					if(req.user.role !== 0 && req.user.role !== 1){
						return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
					}else{
						//delete brand.
						Brand.findByIdAndRemove(req.params.id,function (err) {
							if (err) {
								return apiResponse.ErrorResponse(res, err);
							}else{
								return apiResponse.successResponse(res,'brand delete Success.');
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
