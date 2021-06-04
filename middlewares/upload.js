const util = require('util');
const multer = require('multer');
require('dotenv').config();
const GridFsStorage = require('multer-gridfs-storage');


const storage = new GridFsStorage({
	url: process.env.MONGODB_URL,
	options: { useNewUrlParser: true, useUnifiedTopology: true },
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			const match = ['image/png', 'image/jpeg', 'image/jpg'];

			if (match.indexOf(file.mimetype) === -1) {
				return `${Date.now()}-Ehub-${file.originalname}`;
			}

			const fileInfo = {
				bucketName: 'images',
				filename: `${Date.now()}-Ehub-${file.originalname}`,
				metadata: {type: 'test'}
				// {user: req.user._id},
			};
			resolve(fileInfo);
			reject('Error uploading file to db.');
		});
	}
});

storage.on('connection', (db) => {
	// Db is the database instance
});

storage.on('connectionFailed', (err) => {
	// err is the error received from MongoDb
});

// const uploadFile = multer({storage: storage}).single('file');
const uploadFiles = multer({ storage: storage }).array('multi-files', 10);
const uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
