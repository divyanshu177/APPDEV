const User = require('../models/User');
const Post = require('../models/post');
const Service = require('../models/service');
const mongoose = require('mongoose');


const createPost = async (req, res) => {
    try {
        const {sellerId, serviceId, desc,image ,dummySeller} = req.body;
        console.log(serviceId);
        const service = await Service.findById(serviceId);
 
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        let dummySellerId = null;
        console.log("Dummy Seller:", dummySeller);
        
        if(dummySeller ===0){
            dummySellerId = null;
        }
        else{
        dummySellerId = req.user._id ;
        }
        let costo =0;
        

        console.log("Dummy Sellerid:", dummySellerId);

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        if(dummySeller===0){
            costo = service.originalPrice;

        }
        else{
            costo = service.reducedPrice;
        }
        console.log("Cost:", costo);
        const newPost = new Post({
          serviceId: serviceId,
          sellerId: sellerId,
          desc: desc,
          cost: costo,
          image: image,
          dummyseller: dummySeller,
          dummysellerId: dummySellerId,
          referredAt: new Date()
    });

        await newPost.save();

        

        return res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {
    createPost
};