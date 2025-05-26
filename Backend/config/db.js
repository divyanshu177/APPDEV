const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

  const connectDb = async()=>{
    mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected successfully');
}   ).catch((err) => {
  console.error('MongoDB connection error:', err);
});
  }
  module.exports = connectDb;