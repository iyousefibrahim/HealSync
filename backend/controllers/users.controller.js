const asyncWrapper = require("../middlewares/asyncWrapper");
const Doctor = require("../models/doctor.model");
const Patient = require("../models/patient.model");
const Secretary = require("../models/secretary.model");
const Admin = require('../models/admin.model');
const AppError = require("../utils/appError");
const mongoose = require('mongoose');

// Upload Photos
// pagination

const RoleModels = {
    admin: Admin,
    doctor: Doctor,
    patient: Patient,
    secretary: Secretary
};

exports.getAllUsers = asyncWrapper(async (req, res) => {
    const admins = await Admin.find().select('-password');
    const doctors = await Doctor.find().select('-password');
    const patients = await Patient.find().select('-password');
    const secretaries = await Secretary.find().select('-password');

    const users = {
        admins,
        doctors,
        patients,
        secretaries
    };

    // Check if all arrays are empty
    const isEmpty = Object.values(users).every(arr => arr.length === 0);

    if (isEmpty) {
        throw new AppError('No users found!', 400);
    }

    res.status(200).json({
        status: 'success',
        data: users
    });
});

exports.getUser = asyncWrapper(async (req, res, next) => {
    const { role, username } = req.query;
    const { Id } = req.params;

    const Model = RoleModels[role?.toLowerCase()];
    if (!Model) {
        return res.status(400).json({ status: 'fail', message: 'Invalid role provided.' });
    }

    // Query Search
    if (username) {
        const query = {};

        if (username) query.username = username;

        const user = await Model.find(query).select("-password");
        return res.status(200).json({
            status: 'success',
            data: user
        });
    }

    if (!mongoose.Types.ObjectId.isValid(Id)) {
        return next(new AppError('Invalid user ID format', 400));
    }

    // Get By Id
    const user = await Model.findById(Id).select('-password');
    if (!user) {
        return res.status(404).json({ status: 'fail', message: 'User not found.' });
    }

    res.status(200).json({
        status: 'success',
        data: user
    });

});

exports.createUser = asyncWrapper(async (req, res) => {
    const { role, ...userData } = req.body;

    if (!role || !userData.email) {
        throw new AppError('Please provide role and email!', 400);
    }

    const Model = RoleModels[role.toLowerCase()];
    if (!Model) {
        throw new AppError('Invalid role type!', 400);
    }

    const exists = await Model.findOne({ email: userData.email });
    if (exists) {
        throw new AppError('User already exists!', 409);
    }

    const newUser = await Model.create(userData);

    const userObj = newUser.toObject();
    delete userObj.password;

    res.status(201).json({
        status: 'success',
        data: userObj
    });
});

exports.updateUser = asyncWrapper(async (req, res) => {
    const { Id } = req.params;
    const userData = req.body;

    if (!Id || !mongoose.Types.ObjectId.isValid(Id)) {
        throw new AppError('Please provide a valid ID!', 400);
    }

    if (!userData || Object.keys(userData).length === 0) {
        throw new AppError('Please provide valid user data!', 400);
    }

    if (!userData.role) {
        throw new AppError('Please provide role!', 400);
    }

    const Model = RoleModels[userData.role.toLowerCase()];
    if (!Model) {
        throw new AppError('Invalid role provided!', 400);
    }

    const user = await Model.findById(Id);
    if (!user) {
        throw new AppError('User not found!', 404);
    }

    Object.assign(user, userData);

    await user.save();

    res.status(200).json({
        status: 'success',
        data: user
    });
});

exports.deActiveateUser = asyncWrapper(async (req, res) => {
    const { Id } = req.params;
    const { role } = req.query;

    if (!Id || !mongoose.Types.ObjectId.isValid(Id)) {
        throw new AppError('Please provide a valid ID!', 400);
    }

    if (!role) {
        throw new AppError('Please provide role!', 400);
    }

    const Model = RoleModels[role.toLowerCase()];
    if (!Model) {
        throw new AppError('Invalid role provided!', 400);
    }

    const user = await Model.findById(Id);

    if (!user) throw new AppError('User not found!', 404);
    if (!user.isActive) throw new AppError('User already deactivated!', 400);

    user.isActive = false;
    await user.save();

    res.status(200).json({ status: 'success', data: user });
});

exports.deleteUser = asyncWrapper(async (req, res) => {
    const { Id } = req.params;
    const { role } = req.query;

    if (!Id || !mongoose.Types.ObjectId.isValid(Id)) {
        throw new AppError('Please provide a valid ID!', 400);
    }

    if (!role) {
        throw new AppError('Please provide role!', 400);
    }

    const Model = RoleModels[role.toLowerCase()];
    if (!Model) {
        throw new AppError('Invalid role provided!', 400);
    }

    const deletedUser = await Model.findByIdAndUpdate(Id, { isDeleted: true }, { new: true });
    if (!deletedUser) {
        throw new AppError('User not found!', 404);
    }

    res.status(200).json({
        status: 'success',
        data: null
    });
});