// ai-newsbuzz-backend/src/middlewares/isAdminMiddleware.js
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next(); // User is an admin, proceed
    } else {
        res.status(403).json({ message: 'Forbidden: Admin access required' }); // Not authorized
    }
};

module.exports = { isAdmin };