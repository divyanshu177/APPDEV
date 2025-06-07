const express = require('express');
const connectDb = require('./config/db');
const isLoggedIn = require('./middlewares/isLoggedIn');
const isAuthorized = require('./middlewares/isAuthorized');
const cors = require('cors');

const {
  register, login, logout
} = require('./controllers/authController');

const {
  addService, removeService, updateService, displayServices
} = require('./controllers/SellerController');

const {
  sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getFriendRequests,
  getFriends
} = require('./controllers/friendController');

const {
  createPost, updatePost, removePost, displayPost, getPost, getMyPosts
} = require('./controllers/PostController');

const {
  searchUser, searchPost, getProfile,getAllUsers
} = require('./controllers/UserController');

const {sendMessage,getMessages} = require('./controllers/chatController');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Connect to DB
connectDb().then(() => {
  console.log("Database connected successfully");
});

// Chat routes
app.post('/login/sendMessage', isLoggedIn, sendMessage);
app.get('/login/getMessages/:friendId', isLoggedIn, getMessages);

// Auth routes
app.post('/register', register);
app.post('/login', isAuthorized, login);
app.post('/logout', isLoggedIn, logout);

// Service routes
app.post('/login/addService', isLoggedIn, addService);
app.post('/login/updateService/:serviceId', isLoggedIn, updateService); 
app.delete('/login/removeService/:serviceId', isLoggedIn, removeService);
app.get('/login/getServices', isLoggedIn, displayServices);

// Friend routes
app.post('/login/sendFriendRequest', isLoggedIn, sendFriendRequest);
app.post('/login/acceptFriendRequest', isLoggedIn, acceptFriendRequest);
app.post('/login/rejectFriendRequest', isLoggedIn, rejectFriendRequest);
app.get('/login/getFriendRequests', isLoggedIn, getFriendRequests);
app.get('/login/getFriends', isLoggedIn, getFriends);
// Post routes
app.post('/login/createPost', isLoggedIn, createPost);
app.put('/login/updatePost/:postId', isLoggedIn, updatePost);
app.get('/login/displayPost', isLoggedIn, displayPost);
app.delete('/login/removePost/:postId', isLoggedIn, removePost);
app.get('/login/getPost/:postId', isLoggedIn, getPost);
app.get('/login/getMyPosts', isLoggedIn, getMyPosts);

// User routes
app.get('/login/searchUser', isLoggedIn, searchUser);
app.get('/login/searchPost', isLoggedIn, searchPost); 
app.get('/login/getProfile', isLoggedIn, getProfile);
app.get('/login/getAllUsers',isLoggedIn,getAllUsers)


// Start server (single call)
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
