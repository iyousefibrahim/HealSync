const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/auth.controller');
const usersController = require('../../controllers/users.controller');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRole = require('../../middlewares/verifyRole');

// Admin Authentication Routes
router.post('/auth/admin/login', authController.adminLogin);
// router.get('/auth/admin/me', authController.me);


// Users
router.get('/admin/users', verifyToken, verifyRole('admin'), usersController.getAllUsers);
router.get('/admin/users/:Id', verifyToken, verifyRole('admin'), usersController.getUser);
router.get('/admin/users/search', verifyToken, verifyRole('admin'), usersController.getUser);
router.post('/admin/users', verifyToken, verifyRole('admin'), usersController.createUser);
router.put('/admin/users/:Id', verifyToken, verifyRole('admin'), usersController.updateUser);
router.patch('/admin/users/:Id', verifyToken, verifyRole('admin'), usersController.deActiveateUser);
router.delete('/admin/users/:Id', verifyToken, verifyRole('admin'), usersController.deleteUser);


module.exports = router;