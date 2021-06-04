const express = require('express');

const BrandController = require('../controllers/Vacuum/BrandController.js');

const router = express.Router();

/**
 * @swagger
 *
 * /brand:
 *   get:
 *     produces:
 *       - application/json
 *     description: Get all brands
 *     parameters:
 *       - name: username
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         in: formData
 *         required: true
 *         type: string
 */
router.get('/', BrandController.brandList);
/**
 * @swagger
 * /brand/:id:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 *
 */
router.get('/:id', BrandController.brandDetail);
/**
 * @swagger
 * /brand/:
 *   post:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 *
 */
router.post('/', BrandController.brandStore);
/**
 * @swagger
 * /brand/:id:
 *   put:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 *
 */
router.put('/:id', BrandController.brandUpdate);
/**
 * @swagger
 * /brand/:id:
 *   delete:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 *
 */
router.delete('/:id', BrandController.brandDelete);

module.exports = router;
