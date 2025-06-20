const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/auth.controller');
const usersController = require('../../controllers/users.controller');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRole = require('../../middlewares/verifyRole');
const upload = require('../../middlewares/upload');

// Admin Authentication Routes
router.post('/auth/admin/login', authController.adminLogin);
router.post('/auth/admin/logout', verifyToken, authController.logout);

// Users
router.get('/admin/users', verifyToken, verifyRole('admin'), usersController.getAllUsers);
router.get('/admin/users/:Id', verifyToken, verifyRole('admin'), usersController.getUser);
router.get('/admin/users/search', verifyToken, verifyRole('admin'), usersController.getUser);
router.post('/admin/users', verifyToken, verifyRole('admin'), upload.single('profileImage'), usersController.createUser);
router.put('/admin/users/:Id', verifyToken, verifyRole('admin'), upload.single('profileImage'), usersController.updateUser);
router.patch('/admin/users/:Id', verifyToken, verifyRole('admin'), usersController.deActiveateUser);
router.delete('/admin/users/:Id', verifyToken, verifyRole('admin'), usersController.deleteUser);


module.exports = router;