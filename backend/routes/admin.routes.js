const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/auth.controller');

router.post('/auth/admin/login', authController.adminLogin);
// router.get('/auth/admin/me', authController.me);

module.exports = router;