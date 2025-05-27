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


const updateProduct = async (req, res) => {
  try {
    console.log(req.params)
    const  productId  = req.params.serviceId;
    const sellerId = req.user._id; 
    console.log("Seller ID:", sellerId);
    console.log("Product ID:", productId);

    const product = await Service.findOne({ _id: productId, seller: sellerId });

    if (!product) {
      return res.status(404).json({ message: "Product not found or unauthorized" });
    }

    
    Object.assign(product, req.body);

    await product.save();
    res.status(200).json({ message: "Product updated successfully", product });

  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};


module.exports = {
    addService,
 updateProduct
};