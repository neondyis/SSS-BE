const express = require('express');
const DiagnoseController = require('../controllers/KnowledgeBase/Diagnose/DiagnoseController.js');

const router = express.Router();

router.get('/', DiagnoseController.diagnoseList);
router.get('/:id', DiagnoseController.diagnoseDetail);
router.post('/', DiagnoseController.diagnoseStore);
router.put('/:id', DiagnoseController.diagnoseUpdate);
router.delete('/:id', DiagnoseController.diagnoseDelete);

module.exports = router;
