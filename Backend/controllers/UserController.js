const User = require('../models/User');
const Service = require('../models/service');

const SearchService = async(req,res)=>{
    try{
        const {ServiceName} = req.body;
        console.log("ServiceName:", ServiceName);   
        const service = await Service.find({
  name: { $regex: ServiceName, $options: 'i' }
});

        if(!service || service.length === 0){
            return res.status(404).json({message: "Service not found"});
        }
     return   res.status(200).json({message: "Service found", service});

    }
    catch(e){
        console.error("Error searching Service:", e);
       return res.status(500).json({message: "Internal server error"});
    }

}
const searchUser = async(req, res) =>{
    try{
        username= req.body.name;
        console.log("Searching for user with username:", username);
        const user = await User.find({
            name: { $regex: username, $options: 'i' }
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

    SearchService,
    searchUser
};