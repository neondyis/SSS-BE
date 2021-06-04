const express = require('express');
const IssueController = require('../controllers/KnowledgeBase/Issue/IssueController.js');

const router = express.Router();

router.get('/', IssueController.issueList);
router.get('/:id', IssueController.issueDetail);
router.post('/', IssueController.issueStore);
router.put('/:id', IssueController.issueUpdate);
router.delete('/:id', IssueController.issueDelete);

module.exports = router;
