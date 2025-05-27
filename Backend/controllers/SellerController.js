const Service = require('../models/service');
const addService =async (req,res)=>{
    try{
       const {
  name,
  stock,
  description,
  category,
  image,
  seller,
  reviews,
  originalPrice,
  referralPrice,
  referrerSharePercent,
  sellerSharePercent,
  createdAt
} = req.body;
         if(!name || !stock || !description || !category || !image || !seller || !originalPrice || !referralPrice || !referrerSharePercent || !sellerSharePercent) {
              return res.status(400).json({ message: "All fields are required" });
         }
         
         const newService = new Service({
              name,
              stock,
              description,
              category,
              image,
              seller,
              reviews,
              originalPrice,
              referralPrice,
              referrerSharePercent,
              sellerSharePercent
         });
         
         await newService.save();
         res.status(201).json({ message: "Service added successfully", service: newService });


    }
    catch(error){
        console.error("Error adding service:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    addService
};