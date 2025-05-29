const express = require('express');
const connectDb = require('./config/db');
<<<<<<< HEAD
const User= require('./models/User');
 const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validateSeller = require('./middlewares/validateSeller');
const validateBuyer = require('./middlewares/validateBuyer');
=======
>>>>>>> a576509b37b7331b37b4684d83247ac2acc670a9
const isloggedIn = require('./middlewares/isloggedIn');

<<<<<<< HEAD
const{createRefferal,getAll,prodRef,getAll,ProdRef} = require('./controllers/RefferalController');
const { addFriend } = require('./controllers/UserController');
=======
const { register, login,logout} = require('./controllers/authController');
const { addService, removeService ,updateService,displayServices} = require('./controllers/SellerController');
//const {createRefferal,getAll,ProdRef} = require('./controllers/RefferalController');
const { sendFriendRequest ,acceptFriendRequest,rejectFriendRequest,getFriendRequests} = require('./controllers/friendController');
const {createPost} = require('./controllers/PostController');
//const { SearchProduct, searchUser  } = require('./controllers/UserController');

>>>>>>> a576509b37b7331b37b4684d83247ac2acc670a9

const app = express();
app.use(express.json());

connectDb().then(() => {
    console.log("Database connected successfully");
});


app.post('/register',register);
app.post('/login',login);
app.get('/logout', isloggedIn, logout);
app.post('/login/addService',isloggedIn,addService);
app.post('/login/updateService/:serviceId',isloggedIn,updateService); 
app.delete('/login/removeService/:serviceId',isloggedIn,removeService);
app.get('/login/getServices', isloggedIn,  displayServices);
//app.post('/login/createRef',isloggedIn,createRefferal);
//app.get('/login/getReferrals', isloggedIn, getAll);
//app.get('/login/prodRef/:id', isloggedIn,  ProdRef);

<<<<<<< HEAD
=======
app.post('/login/sendFriendRequest', isloggedIn, sendFriendRequest);
app.post('/login/acceptFriendRequest', isloggedIn, acceptFriendRequest);
app.post('/login/rejectFriendRequest', isloggedIn, rejectFriendRequest);
app.get('/login/getFriendRequests', isloggedIn,  getFriendRequests);
app.post('/login/createPost', isloggedIn, createPost);

//app.get('/login/searchProduct',isloggedIn,  SearchProduct);
//app.get('/login/searchUser', isloggedIn,  searchUser);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
>>>>>>> a576509b37b7331b37b4684d83247ac2acc670a9
