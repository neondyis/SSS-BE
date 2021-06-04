const express = require('express');
const BookController = require('../controllers/Vacuum/VacuumController.js');

const router = express.Router();

router.get('/', BookController.vacuumList);
router.get('/:id', BookController.vacuumDetail);
router.post('/', BookController.vacuumStore);
router.put('/:id', BookController.vacuumUpdate);
router.delete('/:id', BookController.vacuumDelete);

module.exports = router;
