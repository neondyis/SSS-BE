const express = require('express');
const StageTestController = require('../controllers/KnowledgeBase/Testing/StageTestController.js');

const router = express.Router();

router.get('/', StageTestController.stageTestList);
router.get('/:id', StageTestController.stageTestDetail);
router.post('/', StageTestController.stageTestStore);
router.put('/:id', StageTestController.stageTestUpdate);
router.delete('/:id', StageTestController.stageTestDelete);

module.exports = router;
