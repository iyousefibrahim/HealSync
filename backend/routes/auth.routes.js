const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/auth.controller');
const upload = require('../middlewares/upload');
const verifyToken = require('../middlewares/verifyToken');

router.post('/auth/register', upload.single('profileImage'), authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', verifyToken, authController.logout);

module.exports = router;