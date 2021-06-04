const express = require('express');
const RepairController = require('../controllers/KnowledgeBase/Repair/RepairController.js');

const router = express.Router();

router.get('/', RepairController.repairList);
router.get('/:id', RepairController.repairDetail);
router.post('/', RepairController.repairStore);
router.post('/calculate', RepairController.calculateRepairs);
router.put('/:id', RepairController.repairUpdate);
router.delete('/:id', RepairController.repairDelete);

module.exports = router;
