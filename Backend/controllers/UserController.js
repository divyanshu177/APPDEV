const User = require('../models/User');
const Service = require('../models/service');

const SearchProduct = async(req,res)=>{
    try{
        const {productName} = req.body;
        const product = await Service.find({
  name: { $regex: productName, $options: 'i' }
});

        if(!product || product.length === 0){
            return res.status(404).json({message: "Product not found"});
        }
     return   res.status(200).json({message: "Product found", product});

    }
    catch(e){
        console.error("Error searching product:", e);
       return res.status(500).json({message: "Internal server error"});
    }

}
const searchUser = async(req, res) =>{
    try{
        username= req.body.username;
        const user = await User.find({
            username: { $regex: username, $options: 'i' }
        });
        if(!user || user.length === 0){
            return res.status(404).json({message: "User not found"});
        }
        return res.status(200).json({message: "User found", user});
    }
    catch(e){
        console.error("Error searching user:", e);
       return res.status(500).json({message: "Internal server error"});
    }
}
module.exports = {

    SearchProduct,
    searchUser
};