const express = require('express');
const connectDb = require('./config/db');
const User= require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validateSeller = require('./middlewares/validateSeller');
const isloggedIn = require('./middlewares/isloggedIn');
const { addService, removeService ,updateService, updateProduct} = require('./controllers/SellerController');



const app = express();
app.use(express.json());

connectDb().then(() => {
    console.log("Database connected successfully");
});

app.post('/register',async(req, res) => {
    try {
        console.log(req.body);
        const { name, email, password, role } = req.body;
        if(!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if(role !== 'buyer' && role !== 'seller') {
            return res.status(400).json({ message: "Role must be either 'buyer' or 'seller'" });
        }
       
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
      

        const newUser = new User({ name, email, password:hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});

app.post('/login', async (req, res) => {
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
});
   



app.get('/', (req, res) => {
    res.send("Hello World");
});
app.get('/login/info', isloggedIn,validateSeller,(req, res) => {
    try{
    res.json({
        message: "Welcome to the E-commerce API",
        version: "1.0.0",   
    })
}

catch (error) {
    console.error("Error in /login/info route:", error);
    res.status(500).json({ message: "Internal server error" });
}
});     
 
app.post('/login/addService',isloggedIn,validateSeller,addService);
app.post('/login/updateService/:serviceId',isloggedIn,validateSeller,updateProduct); 
app.delete('/login/removeService/:serviceId',isloggedIn,validateSeller,removeService);



app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
