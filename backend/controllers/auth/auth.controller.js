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

// exports.register = asyncWrapper(async (req, res) => {

// });

// exports.login = asyncWrapper(async (req, res) => {

// });


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

exports.adminLogout = asyncWrapper(async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    });

    res.json({ status: httpStatusCode.success, message: "Logged out successfully" });
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