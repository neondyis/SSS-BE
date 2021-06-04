const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/ImageController.js');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index');
});

router.post('/upload', uploadController.uploadFiles);
module.exports = router;
