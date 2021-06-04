const express = require('express');
const LabelController = require('../controllers/Vacuum/LabelController.js');

const router = express.Router();

router.get('/', LabelController.labelList);
router.get('/:id', LabelController.labelDetail);

module.exports = router;
