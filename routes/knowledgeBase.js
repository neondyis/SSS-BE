const express = require('express');
const KnowledgeBaseController = require('../controllers/KnowledgeBase/KnowledgeBaseController.js');

const router = express.Router();

router.get('/', KnowledgeBaseController.knowledgeBaseList);
router.get('/:id', KnowledgeBaseController.knowledgeBaseDetail);
router.post('/', KnowledgeBaseController.knowledgeBaseStore);
router.put('/:id', KnowledgeBaseController.knowledgeBaseUpdate);
router.delete('/:id', KnowledgeBaseController.knowledgeBaseDelete);

module.exports = router;
