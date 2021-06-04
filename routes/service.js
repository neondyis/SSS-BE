const express = require('express');
const ServiceController = require('../controllers/Service/ServiceController.js');

const router = express.Router();

router.get('/', ServiceController.serviceList);
router.get('/:id', ServiceController.serviceDetail);
router.post('/', ServiceController.serviceStore);
router.put('/:id', ServiceController.serviceUpdate);
router.delete('/:id', ServiceController.serviceDelete);

module.exports = router;
