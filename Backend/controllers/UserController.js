const User = require('../models/User');
const Post = require('../models/post');
const Service = require('../models/service');
const upload = require('../middlewares/upload');


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

    // Separate priority posts (posted by friends) and others
    const priorityPosts = posts.filter(post => 
      req.user.friends.includes(post.dummysellerId?.toString())
    );
    const otherPosts = posts.filter(post => 
      !req.user.friends.includes(post.dummysellerId?.toString())
    );

    // Combine, putting priority posts first
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

const uploadProfile=async (req, res) => {
  try {
    console.log('Upload:');

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

    const user = await User.findById(req.params.id);

    // Optional: remove old file
    if (user.profilePicture) {
      const oldPath = path.join(__dirname, '..', 'uploads', user.profilePicture);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    user.profilePicture = req.file.filename;
    await user.save();


    res.status(200).json({ success: true, profilePicture: user.profilePicture });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading image' });
  }
};



module.exports = {
    searchUser,
    searchPost,
    getProfile,
    getAllUsers,
    uploadProfile
};