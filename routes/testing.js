const express = require('express');
const TestController = require('../controllers/KnowledgeBase/Testing/TestingController.js');

const router = express.Router();

router.get('/', TestController.testList);
router.get('/:id', TestController.testDetail);
router.post('/', TestController.testStore);
router.put('/:id', TestController.testUpdate);
router.delete('/:id', TestController.testDelete);

module.exports = router;
