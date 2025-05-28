
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

  role: {
    type: String,
    enum: ['buyer', 'seller'],
    required: true,
  },

  walletBalance: {
    type: Number,
    default: 0,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  friends:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }]

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
