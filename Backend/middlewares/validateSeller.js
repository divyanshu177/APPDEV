const validateSeller = (req, res, next) => {
    const { role } = req.user;

    if (role !== 'seller') {
        return res.status(403).json({ message: "Access denied. Only sellers are allowed." });
    }

    next();
}
module.exports = validateSeller;