const User = require('../models/User');
const addFriend = async(req,res)=>{
    try{
        const {friendId} = req.body;
        if(!friendId){
            return res.status(400).json({message: "Friend ID is required"});
        }
        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        if(user.friends.includes(friendId)){
            return res.status(400).json({message: "Already friends"});
        }
        user.friends.push(friendId);
        await user.save();
        const friend = await User.findById(friendId);
        if(!friend){
            return res.status(404).json({message: "Friend not found"});
        }
        const friendName = friend.name || "Unknown";

        res.status(200).json({message: "Friend added successfully", friends: user.friends, friendName: friendName});

    }
    catch(e){
        console.error("Error adding friend:", e);
        res.status(500).json({message: "Internal server error"});

    }
}
module.exports = {
    addFriend
};