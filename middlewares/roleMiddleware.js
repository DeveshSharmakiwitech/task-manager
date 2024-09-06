const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.roles[0])) {
            return res.status(403).json({ message: 'Forbidden: Access denied' });
        }
        next();
    };
};

module.exports = { authorize };
