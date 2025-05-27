const validateBuyer = (req, res, next) => {
    const { role } = req.user;

    if (role !== 'buyer') {
        return res.status(403).json({ message: "Access denied. Only buyers are allowed." });
    }

    next();
}
module.exports = validateBuyer;