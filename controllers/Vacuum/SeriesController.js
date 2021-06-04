const Series = require('../../models/Vacuum/SeriesModel.js');
const { body,validationResult } = require('express-validator');
const { check } = require('express-validator');
const apiResponse = require('../../helpers/apiResponse.js');
const auth = require('../../middlewares/jwt.js');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// Series Schema
function SeriesData(data) {
	this.id = data._id;
	this.brand = data.brand;
	this.name= data.name;
}

/**
 * Series List.
 *
 * @returns {Object}
 */
exports.seriesList = [
	auth,
	function (req, res) {
		try {
			Series.find({},'_id name brand').then((series)=>{
				if(series.length > 0){
					return apiResponse.successResponseWithData(res, 'Operation success', series);
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
 * Series Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.seriesDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, 'Operation success', {});
		}
		try {
			Series.findOne({_id: req.params.id},'_id Name').then((series)=>{
				if(series !== null){
					let seriesData = new SeriesData(series);
					return apiResponse.successResponseWithData(res, 'Operation success', seriesData);
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
 * Series store.
 *
 * @param {string}  name
 * @param {string}  brand
 *
 * @returns {Object}
 */
exports.seriesStore = [
	auth,
	body('brand', 'Brand must not be empty.').isLength({ min: 1 }).trim(),
	body('name', 'Name must not be empty.').isLength({ min: 1 }).trim()
		.custom((value) => {
			return Series.findOne({name : value}).then(series => {
				if (series) {
					return Promise.reject('Series already exist.');
				}
			});
		}),
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const series = new Series(
				{
					name: req.body.name,
					brand: req.body.brand,
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				//Save series.
				series.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let seriesData = new SeriesData(series);
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
 * Series update.
 *
 * @param {string}      name
 * @param {string}      brand
 *
 * @returns {Object}
 */
exports.seriesUpdate = [
	auth,
	body('brand', 'Brand must not be empty.').isLength({ min: 1 }).trim(),
	body('name', 'Name must not be empty.').isLength({ min: 1 }).trim()
		.custom((value,{req}) => {
			return Series.findOne({name : value, _id: { '$ne': req.params.id }}).then(series => {
				if (series) {
					return Promise.reject('Series already exist with this ISBN no.');
				}
			});
		}),
	check('*').escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const series =
				{
					brand: req.body.brand,
					name: req.body.name
				};

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
				}else{
					Series.findById(req.params.id, function (err, foundSeries) {
						if(foundSeries === null){
							return apiResponse.notFoundResponse(res,'Series not exists with this id');
						}else{
							//Check authorized user
							if(req.user.role !== 0 && req.user.role !== 1){
								return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
							}else{
								//update series.
								Series.findByIdAndUpdate(req.params.id, series, {},function (err) {
									if (err) {
										return apiResponse.ErrorResponse(res, err);
									}else{
										let seriesData = new SeriesData(series);
										return apiResponse.successResponseWithData(res,'Series update Success.', seriesData);
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
 * Series Delete.
 *
 * @param {string} id
 *
 * @returns {Object}
 */
exports.seriesDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID');
		}
		try {
			Series.findById(req.params.id, function (err, foundSeries) {
				if(foundSeries === null){
					return apiResponse.notFoundResponse(res,'Series not exists with this id');
				}else{
					//Check authorized user
					if(req.user.role !== 0 && req.user.role !== 1){
						return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.');
					}else{
						//delete series.
						Series.findByIdAndRemove(req.params.id,function (err) {
							if (err) {
								return apiResponse.ErrorResponse(res, err);
							}else{
								return apiResponse.successResponse(res,'Series delete Success.');
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
