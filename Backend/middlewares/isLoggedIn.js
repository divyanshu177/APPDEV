const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const isloggedIn = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("Authorization header:", authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Unauthorized access. Token missing." });
        }

        const token = authHeader.split(' ')[1];
        console.log("Token received:", token);

        const decoded = jwt.verify(token, process.env.SECRET);
        console.log("Decoded token:", decoded);
        const user = await User.findById(decoded.id);

        if (!user ) {
            return res.status(401).json({ message: "Invalid or expired token." });
        }

        req.user = user; 
        next();
    } catch (error) {
        console.error("Error in isloggedIn middleware:", error);
        return res.status(401).json({ message: "Unauthorized access." });
    }
};

module.exports = isloggedIn;
