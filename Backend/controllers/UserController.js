const User = require('../models/User');
const Post = require('../models/post');
const Service = require('../models/service');
const upload = require('../middlewares/upload');
const path = require('path');
const fs = require('fs')


const searchUser = async(req, res) =>{
    try{
        const username = req.query.query;
        console.log("Searching for user with username:", username);
        const user = await User.find({
            name: { $regex: username, $options: 'i' }
        });
        if(!user || user.length === 0){
            return res.status(404).json({message: "User not found"});
        }
        return res.status(200).json({message: "User found", users: user});
    }
    catch(e){
        console.error("Error searching user:", e);
       return res.status(500).json({message: "Internal server error"});
    }
}

const searchPost = async (req, res) => {
  try {
    const serviceName = req.query.serviceName;
    console.log("Searching for posts with serviceName:", serviceName);

    const posts = await Post.find({
      serviceName: { $regex: serviceName, $options: 'i' }
    }).populate('serviceId')
      .populate('sellerId')
      .populate('dummysellerId');

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

  
    const priorityPosts = posts.filter(post => 
      req.user.friends.includes(post.dummysellerId?.toString())
    );
    const otherPosts = posts.filter(post => 
      !req.user.friends.includes(post.dummysellerId?.toString())
    );

    
    const sortedPosts = [...priorityPosts, ...otherPosts];

    console.log("Filtered priority posts:", priorityPosts);

    return res.status(200).json({ message: "Posts found", posts: sortedPosts });
  } catch (e) {
    console.error("Error searching post:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getProfile = async (req, res) => {
    try {
        const profile = req.user._id;
        
        const findProfile = await User.findById(profile);
        console.log( findProfile);
        return res.status(200).json({ message: "your profile", profile: findProfile });
    }
    catch (error) {
        console.error("Error getting profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean(); // Ensure users is plain JSON
    return res.status(200).json({ message: "All users", users });
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
const viewUserProfile = async (req, res) => {
  try {
   // const { userId } = req.body;
   const userId = req.params.id;
    const profile = await User.findById(userId).select('-password');
    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User profile found', profile });
  } catch (error) {
    console.error('Error viewing user profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




const uploadProfile = async (req, res) => {
  console.log(req.params.id)

  try {
    console.log('Upload request received.');
    
    
  

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user = await User.findById(req.params.id);
    console.log(user)
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Remove old image
    if (user.profilePicture) {
      const oldPath = path.join(__dirname, '..', 'uploads', path.basename(user.profilePicture));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

   
    const fullUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    user.profilePicture = fullUrl;
    await user.save();

    res.status(200).json({ success: true, profilePicture: user.profilePicture });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Error uploading image' });
  }
};

const updateName = async (req, res) => {
  console.log("Updating name for user:", req.user._id);
  console.log("Request body:", req.body);
  try {
    const newName = req.body.name;
    const userId = req.user._id;


    const user = await User.findById(userId);
    console.log("User found:", user);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = newName;
    await user.save();

    return res.status(200).json({ message: "Name updated successfully", user });
  } catch (error) {
    console.error("Error updating name:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updatePhone = async (req, res) => {
  console.log("Updating phone number for user:", req.user._id);
  try {
    const newPhone = req.body.phone;
    const userId = req.user._id;

    const user = await User.findById(userId);
    console.log("User found:", user);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.phone = newPhone;
    await user.save();

    return res.status(200).json({ message: "Phone number updated successfully", user });
  } catch (error) {
    console.error("Error updating phone:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}



module.exports = {
    searchUser,
    searchPost,
    getProfile,
    getAllUsers,
    viewUserProfile,
    uploadProfile,
    updateName,
    updatePhone
};