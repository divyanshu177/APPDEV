
// const Message = require('./models/Message');
// const User = require('./models/User');
// const express = require('express');
// const connectDb = require('./config/db');
// const isLoggedIn = require('./middlewares/isLoggedIn');
// const isAuthorized = require('./middlewares/isAuthorized');
// const cors = require('cors');

// const app = express(); // ❗️ You missed this line earlier!

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// // Database
// connectDb().then(() => {
//   console.log("Database connected successfully");
// });

// // HTTP & Socket.IO setup
// const http = require('http');
// const server = http.createServer(app);
// const socketIO = require('socket.io');
// const io = socketIO(server, {
//   cors: {
//     origin: '*',
//   },
// });

// // Socket.IO handling
// io.on('connection', (socket) => {
//   console.log('New client connected');

//   socket.on('joinRoom', ({ userId }) => {
//     socket.join(userId); // Join personal room
//   });

//   socket.on('sendMessage', async ({ senderId, receiverId, content }) => {
//     try {
//       // Save message to DB
//       const message = await Message.create({ sender: senderId, receiver: receiverId, content });

//       const sender = await User.findById(senderId);
//       const receiver = await User.findById(receiverId);
//       sender.chats.push(message);
//       receiver.chats.push(message);
//       await sender.save();
//       await receiver.save();

//       // Emit to receiver and optionally to sender
//       io.to(receiverId).emit('receiveMessage', message);
//       io.to(senderId).emit('receiveMessage', message);
//     } catch (err) {
//       console.error('❌ Error in sendMessage socket:', err.message);
//       socket.emit('errorMessage', 'Failed to send message');
//     }
//   });


//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// // ROUTES
// const {
//   register, login, logout
// } = require('./controllers/authController');

// const {
//   addService, removeService, updateService, displayServices
// } = require('./controllers/SellerController');

// const {
//   sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getFriendRequests,
//   getFriends
// } = require('./controllers/friendController');

// const {
//   createPost, updatePost, removePost, displayPost, getPost, getMyPosts
// } = require('./controllers/PostController');

// const {
//   searchUser, searchPost, getProfile, getAllUsers
// } = require('./controllers/UserController');

// const { sendMessage, getMessages } = require('./controllers/chatController');

// // Chat routes
// app.post('/login/sendMessage', isLoggedIn, sendMessage);
// app.get('/login/getMessages/:friendId', isLoggedIn, getMessages);

// // Auth routes
// app.post('/register', register);
// app.post('/login', isAuthorized, login);
// app.post('/logout', isLoggedIn, logout);

// // Service routes
// app.post('/login/addService', isLoggedIn, addService);
// app.post('/login/updateService/:serviceId', isLoggedIn, updateService);
// app.delete('/login/removeService/:serviceId', isLoggedIn, removeService);
// app.get('/login/getServices', isLoggedIn, displayServices);

// // Friend routes
// app.post('/login/sendFriendRequest', isLoggedIn, sendFriendRequest);
// app.post('/login/acceptFriendRequest', isLoggedIn, acceptFriendRequest);
// app.post('/login/rejectFriendRequest', isLoggedIn, rejectFriendRequest);
// app.get('/login/getFriendRequests', isLoggedIn, getFriendRequests);
// app.get('/login/getFriends', isLoggedIn, getFriends);

// // Post routes
// app.post('/login/createPost', isLoggedIn, createPost);
// app.put('/login/updatePost/:postId', isLoggedIn, updatePost);
// app.get('/login/displayPost', isLoggedIn, displayPost);
// app.delete('/login/removePost/:postId', isLoggedIn, removePost);
// app.get('/login/getPost/:postId', isLoggedIn, getPost);
// app.get('/login/getMyPosts', isLoggedIn, getMyPosts);

// // User routes
// app.get('/login/searchUser', isLoggedIn, searchUser);
// app.get('/login/searchPost', isLoggedIn, searchPost);
// app.get('/login/getProfile', isLoggedIn, getProfile);
// app.get('/login/getAllUsers', isLoggedIn, getAllUsers);

// // ✅ Only this server.listen() should be used
// server.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });




const express = require('express');
const http = require('http');
const cors = require('cors');

const connectDb = require('./config/db');
const isLoggedIn = require('./middlewares/isLoggedIn');
const isAuthorized = require('./middlewares/isAuthorized');
const socket = require('./socket'); // ✅ import socket.js

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
  searchUser, searchPost, getProfile, getAllUsers, viewUserProfile
} = require('./controllers/UserController');
const {
  sendMessage, getMessages
} = require('./controllers/chatController');

// App setup
const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to DB
connectDb().then(() => {
  console.log("✅ Database connected");
});

// Initialize Socket.IO
const io = socket.init(server); // ✅ initialize and pass server
app.set('io', io); // optional: allows access via req.app.get('io')

// Routes — Chat
app.post('/login/sendMessage', isLoggedIn, sendMessage);
app.get('/login/getMessages/:friendId', isLoggedIn, getMessages);

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

// Routes — Users
app.get('/login/searchUser', isLoggedIn, searchUser);
app.get('/login/searchPost', isLoggedIn, searchPost);
app.get('/login/getProfile', isLoggedIn, getProfile);
app.get('/login/getAllUsers', isLoggedIn, getAllUsers);
app.get('/login/viewUserProfile', isLoggedIn, viewUserProfile);

// Start Server
server.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
