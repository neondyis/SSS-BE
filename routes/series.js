const express = require('express');
const SeriesController = require('../controllers/Vacuum/SeriesController.js');

const router = express.Router();

router.get('/', SeriesController.seriesList);
router.get('/:id', SeriesController.seriesDetail);
router.post('/', SeriesController.seriesStore);
router.put('/:id', SeriesController.seriesUpdate);
router.delete('/:id', SeriesController.seriesDelete);

module.exports = router;
