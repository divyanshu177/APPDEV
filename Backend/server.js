const path = require('path');
const express = require('express');
const http = require('http');
const cors = require('cors');

const connectDb = require('./config/db');
const isLoggedIn = require('./middlewares/isLoggedIn');
const isAuthorized = require('./middlewares/isAuthorized');
const socket = require('./socket'); // ✅ import socket.js
const upload = require('./middlewares/upload');

const { Server } = require('socket.io');


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
  createPost, updatePost, removePost, displayPost, getPost, getMyPosts,getPostByUser,uploadImages
} = require('./controllers/PostController');
const {
  searchUser, searchPost, getProfile, getAllUsers, viewUserProfile, uploadProfile
} = require('./controllers/UserController');
const {
  sendMessage, getMessages, markAsRead, getUnreadCounts
} = require('./controllers/chatController');

// App setup
const { createPaymentLink,storeOrders,paymentSuccess,getOrders} = require('./controllers/payController');


const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
connectDb().then(() => {
  console.log("✅ Database connected");
});
app.use(express.json({ limit: '10mb' }));  // 10 MB limit
app.use(express.urlencoded({ limit: '10mb', extended: true }));




// Initialize Socket.IO
const io = socket.init(server); // ✅ initialize and pass server
app.set('io', io); // optional: allows access via req.app.get('io')

// Routes — Chat
app.post('/login/sendMessage', isLoggedIn, sendMessage);
app.get('/login/getMessages/:friendId', isLoggedIn, getMessages);
app.get('/login/getUnreadCounts', isLoggedIn, getUnreadCounts);
app.post('/login/markAsRead', isLoggedIn, markAsRead);
// Routes — Auth
app.post('/register', register);
app.post('/login', isAuthorized, login);
app.post('/logout', isLoggedIn, logout);


// Routes — Services
app.post('/login/addService', isLoggedIn, addService);
app.post('/login/updateService/:serviceId', isLoggedIn, updateService);
app.delete('/login/removeService/:serviceId', isLoggedIn, removeService);
app.get('/login/getServices', isLoggedIn, displayServices);

// Routes — Friends

app.post('/login/sendFriendRequest', isLoggedIn, sendFriendRequest);
app.post('/login/acceptFriendRequest', isLoggedIn, acceptFriendRequest);
app.post('/login/rejectFriendRequest', isLoggedIn, rejectFriendRequest);
app.get('/login/getFriendRequests', isLoggedIn, getFriendRequests);
app.get('/login/getFriends', isLoggedIn, getFriends);

// Routes — Posts

app.post('/login/createPost', isLoggedIn, createPost);
app.put('/login/updatePost/:postId', isLoggedIn, updatePost);
app.get('/login/displayPost', isLoggedIn, displayPost);
app.delete('/login/removePost/:postId', isLoggedIn, removePost);
app.get('/login/getPost/:postId', isLoggedIn, getPost);
app.get('/login/getMyPosts', isLoggedIn, getMyPosts);
app.post('/login/getPostByUser', isLoggedIn, getPostByUser);


app.post('/login/uploadImages',upload.any(), uploadImages);



// Routes — Users

app.get('/login/searchUser', isLoggedIn, searchUser);
app.get('/login/searchPost', isLoggedIn, searchPost);
app.get('/login/getProfile', isLoggedIn, getProfile);
app.get('/login/getAllUsers', isLoggedIn, getAllUsers);
app.get('/api/user/:id', isLoggedIn, viewUserProfile);

//app.get('/login/viewUserProfile', isLoggedIn, viewUserProfile);

// Routes — Payment
app.post('/login/createPaymentLink', isLoggedIn, createPaymentLink);



// Start Server
app.post('/login/updateProfilePicture/:id', upload.single('profilePicture'), uploadProfile);


app.post('/createPaymentLink', createPaymentLink);
app.post('/login/paymentSuccess',isLoggedIn,paymentSuccess);
app.post('/login/storeOrders',isLoggedIn,storeOrders);
app.get('/login/getOrders',isLoggedIn,getOrders);


//app.post('/login/paymentSuccess',isLoggedIn,paymentSuccess);
//app.post('/login/storeOrders',isLoggedIn,storeOrders);
//app.get('/login/getOrders',isLoggedIn,getOrders);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
