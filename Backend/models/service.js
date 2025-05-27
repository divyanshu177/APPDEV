const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
    type: String,
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      
    },
    rating: {
      type: Number,
     
      min: 1,
      max: 5
    },
    comment: {
      type: String,
    
    }
  }],
 originalPrice: {
    type: Number,
    required: true,
  },

  referralPrice: {
    type: Number,
    required: true,
    validate: {
      validator: function(value) {
        return value < this.originalPrice;
      },
      message: "Referral price must be less than original price"
    }
  },

  referrerSharePercent: {
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

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
