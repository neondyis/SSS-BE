const upload = require('../middlewares/upload');
const apiResponse = require('../helpers/apiResponse');
const auth = require('../middlewares/jwt');

exports.uploadFiles = [
	// auth,
	async function (req, res) {
		try {
			await upload(req, res);
			if (req.files.length <= 0) {
				return apiResponse.successResponseWithData(res, 'You must select at least 1 file.');
			}
			// TODO add saving diagram or saving to passport
			return apiResponse.successResponseWithData(res, 'Files have been uploaded.', req.files);
		} catch (error) {
			if (error.code === 'LIMIT_UNEXPECTED_FILE') {
				return apiResponse.ErrorResponse(res, 'Too many files to upload.');
			}
			return apiResponse.ErrorResponse(res, `Error when trying upload many files: ${error}`);
		}
	}
];
