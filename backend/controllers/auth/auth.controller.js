const createJWT = require('../../utils/createJWT');
const asyncWrapper = require('../../middlewares/asyncWrapper');
const AppError = require('../../utils/appError');
const Doctor = require("../../models/doctor.model");
const Patient = require("../../models/patient.model");
const Secretary = require("../../models/secretary.model");
const Admin = require('../../models/admin.model');
const bcrypt = require('bcryptjs');
const httpStatusCode = require('../../utils/httpStatusCode');

const RoleModels = {
    admin: Admin,
    doctor: Doctor,
    patient: Patient,
    secretary: Secretary
};

// Register is for patients Only!
exports.register = asyncWrapper(async (req, res) => {
    const { firstName, lastName, username, password, phone, email } = req.body;

    if (!firstName || !lastName || !username || !password || !phone || !email) {
        throw new AppError("All fields are required!", 400);
    }

    if (!req.file || !req.file.path) {
        throw new AppError("User profile image is required!", 400);
    }

    const existsUser = await Patient.findOne({
        $or: [{ email }, { username }]
    });

    if (existsUser) {
        throw new AppError("Email or username already exists!", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await Patient.create({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        phone,
        profileImage: req.file.path
    });

    user.password = undefined;

    const token = await createJWT({
        email: user.email,
        username: user.username,
        id: user._id,
        role: 'patient'
    });

    res.cookie('token', token, {
        httpOnly: true,
        maxAge: parseInt(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
        secure: false,
        sameSite: 'strict',
    });

    res.json({
        status: httpStatusCode.success,
        token
    });
});

exports.login = asyncWrapper(async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        throw new AppError("Email, password, and role are required!", 400);
    }

    const model = RoleModels[role.toLowerCase()];
    if (!model) {
        throw new AppError("Invalid role!", 400);
    }

    const user = await model.findOne({ email });
    if (!user) {
        throw new AppError("Invalid email or password!", 401);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new AppError("Invalid email or password!", 401);
    }

    const token = await createJWT({
        id: user._id,
        email: user.email,
        username: user.username,
        role
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: parseInt(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    });

    user.password = undefined;

    res.status(200).json({
        status: "success",
        token,
    });
});

exports.logout = asyncWrapper(async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    });

    res.json({ status: httpStatusCode.success, message: "Logged out successfully" });
});

exports.adminLogin = asyncWrapper(async (req, res) => {

    const { email, password, username } = req.body;

    if ((!email && !username) || !password) {
        throw new AppError("Email or username and password are required", 400);
    }

    const oldAdmin = await Admin.findOne({ $or: [{ email }, { username: username }] });
    if (!oldAdmin || !(await bcrypt.compare(password, oldAdmin.password))) {
        throw new AppError("Invalid email or password", 401);
    }

    const adminId = oldAdmin._id;
    const token = await createJWT({ email, username, id: adminId, role: 'admin' });

    res.cookie('token', token, {
        httpOnly: true,
        maxAge: parseInt(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
        secure: false,
        sameSite: 'strict',
    });

    res.json({ status: httpStatusCode.success, token });

});

exports.me = asyncWrapper(async (req, res) => {
    const user = req.user;
    const model = RoleModels[user.role.toLowerCase()];

    const me = await model.findById(user.id).select('-password');
    if (!me) {
        throw new AppError('No user found!', 400)
    }
    res.json({
        status: httpStatusCode.success,
        data: me
    })
});