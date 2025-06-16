const mongoose = require('mongoose');
const service = require('./service');

const postSchema = new mongoose.Schema({
    serviceId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    serviceName: {
        type: String, 
        required: true
    },  
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    referredAt: {
        type: Date,
        default: Date.now
    },
   
    cost:{
        type: Number,
        required: true
    },
    image: {
        type: [String],
        required: true
    },
    dummyseller: {
       type:Number,
       enum: [0, 1], // 0 for no dummy seller, 1 for dummy seller
       default: 0
    },
    dummysellerId: {    
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    review:{
        type:String
    },
});



const Post = mongoose.model('Post', postSchema);

module.exports = Post;
