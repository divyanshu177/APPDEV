const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register=async(req, res) => {
    try {
        console.log(req.body);
        const { name, email, password, phone } = req.body;
        if(!name || !email || !password || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const newUser = new User({ name, email, password:hashedPassword, phone });
     
        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

const login= async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

       
      const token =   jwt.sign(
            { id: user._id },
            process.env.SECRET,
            { expiresIn: '24h' },
      )
             

                if(!token) {
                    return res.status(500).json({ message: "Error generating token" });
                }
               user.token = token;
               await user.save();
                console.log("User logged in:", user);
                res.status(200).json({
                    message: "Login successful",
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name ,
                        token: user.token
                    }
                });
            }
    catch (error) {
        console.error("Error in /login route:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const logout = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        user.token = null; 
        await user.save();

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error in /logout route:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports={register,login,logout};
