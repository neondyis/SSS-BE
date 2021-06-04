const express = require('express');
const RepairStepController = require('../controllers/KnowledgeBase/Repair/RepairStepController.js');

const router = express.Router();

router.get('/', RepairStepController.repairStepList);
router.get('/:id', RepairStepController.repairStepDetail);
router.post('/', RepairStepController.repairStepStore);
router.put('/:id', RepairStepController.repairStepUpdate);
router.delete('/:id', RepairStepController.repairStepDelete);

module.exports = router;
