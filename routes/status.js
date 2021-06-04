const express = require('express');
const StatusController = require('../controllers/Vacuum/StatusController.js');

const router = express.Router();

router.get('/', StatusController.statusList);
router.get('/:id', StatusController.statusDetail);
router.post('/', StatusController.statusStore);

module.exports = router;
