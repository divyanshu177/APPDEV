const path = require('path');
const express = require('express');
const connectDb = require('./config/db');
const isLoggedIn = require('./middlewares/isLoggedIn');
const isAuthorized = require('./middlewares/isAuthorized');
const cors = require('cors');
const upload = require('./middlewares/upload');
const http = require('http');
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
  createPost, updatePost, removePost, displayPost, getPost, getMyPosts
} = require('./controllers/PostController');

const {
  searchUser, searchPost, getProfile, getAllUsers, uploadProfile
} = require('./controllers/UserController');

const { sendMessage, getMessages } = require('./controllers/chatController');

const { createPaymentLink,paymentSuccess,storeOrders,getOrders } = require('./controllers/payController');


const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


connectDb().then(() => {
  console.log("Database connected successfully");
});


io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('sendMessage', (data) => {
    console.log('Received message:', data);
    io.emit('receiveMessage', data); 
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


app.post('/login/sendMessage', isLoggedIn, sendMessage);
app.get('/login/getMessages/:friendId', isLoggedIn, getMessages);


app.post('/register', register);
app.post('/login', isAuthorized, login);
app.post('/logout', isLoggedIn, logout);


app.post('/login/addService', isLoggedIn, addService);
app.post('/login/updateService/:serviceId', isLoggedIn, updateService);
app.delete('/login/removeService/:serviceId', isLoggedIn, removeService);
app.get('/login/getServices', isLoggedIn, displayServices);


app.post('/login/sendFriendRequest', isLoggedIn, sendFriendRequest);
app.post('/login/acceptFriendRequest', isLoggedIn, acceptFriendRequest);
app.post('/login/rejectFriendRequest', isLoggedIn, rejectFriendRequest);
app.get('/login/getFriendRequests', isLoggedIn, getFriendRequests);
app.get('/login/getFriends', isLoggedIn, getFriends);


app.post('/login/createPost', isLoggedIn, createPost);
app.put('/login/updatePost/:postId', isLoggedIn, updatePost);
app.get('/login/displayPost', isLoggedIn, displayPost);
app.delete('/login/removePost/:postId', isLoggedIn, removePost);
app.get('/login/getPost/:postId', isLoggedIn, getPost);
app.get('/login/getMyPosts', isLoggedIn, getMyPosts);


app.get('/login/searchUser', isLoggedIn, searchUser);
app.get('/login/searchPost', isLoggedIn, searchPost);
app.get('/login/getProfile', isLoggedIn, getProfile);
app.get('/login/getAllUsers', isLoggedIn, getAllUsers);
app.post('/login/updateProfilePicture/:id', upload.single('profilePicture'), uploadProfile);


app.post('login/createPaymentLink',createPaymentLink);
//app.post('/login/paymentSuccess',isLoggedIn,paymentSuccess);
//app.post('/login/storeOrders',isLoggedIn,storeOrders);
//app.get('/login/getOrders',isLoggedIn,getOrders);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


