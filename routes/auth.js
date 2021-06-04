const express = require('express');
const AuthController = require('../controllers/User/AuthController.js');
const router = express.Router();

router.post('/register', AuthController.register);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     description: Login to the application
 *     tags: [Login]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: User's username.
 *         in: formData
 *         required: true
 *         type: string
 *
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       0:
 *         description: Error
 *       1:
 *          description: Success
 */
router.post('/login', AuthController.login);
router.post('/verify-otp', AuthController.verifyConfirm);
router.post('/resend-verify-otp', AuthController.resendConfirmOtp);

module.exports = router;
