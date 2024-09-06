const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validateEmail, validatePassword } = require('../utils/validator');
const sendEmail = require('../utils/sendEmail');
const rateLimit = require('express-rate-limit');

// Set up rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, 
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
    standardHeaders: true, 
    legacyHeaders: false,
});


const register = async (req, res) => {
    const { username, email, password, roles } = req.body;

    if (!validateEmail(email) || !validatePassword(password)) {
        return res.status(400).json({ message: 'Invalid email or password format' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ username, email, password, roles });
        const token = jwt.sign({ id: user._id, roles: user.roles }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send confirmation email
        const message = `Welcome, ${user.username}!\n\nYour registration is successful.`;
        await sendEmail({
            email: user.email,
            subject: 'Registration Confirmation',
            message,
        });

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, roles: user.roles }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const logout = (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { register, login, loginLimiter, logout };
