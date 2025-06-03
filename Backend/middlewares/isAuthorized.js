
const bcrypt = require('bcrypt'); // if passwords are hashed
const User = require('../models/User'); // adjust path based on your project

const isAuthorized = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }   // 2. Compare password (hashed)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    
    req.user = user;
    next(); 
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = isAuthorized;
