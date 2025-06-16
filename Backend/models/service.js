const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: [String],
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
 originalPrice: {
    type: Number,
    required: true,
  },

  reducedPrice: {
    type: Number,
    required: true,
    validate: {
      validator: function(value) {
        return value < this.originalPrice;
      },
      message: "Reduced price must be less than original price"
    }
  },
  

  dummysellerSharePercent: {
    type: Number,
    default: 10, 
    min: 0,
    max: 100
  },

  sellerSharePercent: {
    type: Number,
    default: 90, 
    min: 0,
    max: 100
  },
   dummyseller:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
   },
   
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const service = mongoose.model('Service', serviceSchema);

module.exports = service;
