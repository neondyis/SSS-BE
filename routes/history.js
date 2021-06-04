const express = require('express');
const HistoryController = require('../controllers/HistoryController');

const router = express.Router();

router.get('/', HistoryController.HistoryList);
router.get('/:id', HistoryController.HistoryDetail);
router.post('/', HistoryController.HistoryStore);
router.put('/:id', HistoryController.HistoryUpdate);
router.delete('/:id', HistoryController.HistoryDelete);

module.exports = router;
