
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
    unique: true,
  },

  profilePicture: {
    type: String,
    default: '',
  },

  walletBalance: {
    type: Number,
    default: 0,
  },

  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  }],

  friendsRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  friends:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  chats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  }],

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
