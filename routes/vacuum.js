const express = require('express');
const VacuumController = require('../controllers/Vacuum/VacuumController.js');

const router = express.Router();

router.get('/', VacuumController.vacuumList);
router.get('/:id', VacuumController.vacuumDetail);
router.post('/', VacuumController.vacuumStore);
router.put('/:id', VacuumController.vacuumUpdate);
router.delete('/:id', VacuumController.vacuumDelete);

module.exports = router;
