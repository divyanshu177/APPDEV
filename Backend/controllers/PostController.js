const User = require('../models/User');
const Post = require('../models/post');
const Service = require('../models/service');

const createPost = async (req, res) => {

    try {
        const {sellerId, serviceId, desc, images, dummySellerId, review} = req.body;
        console.log("Request body:", req.body);

        console.log("creating post");
       
        const service = await Service.findById(serviceId);
       
 
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

         const serviceName= service.name;
       
        let dummySeller=0;

        if(dummySellerId!==null){
            dummySeller=1;
        }

        let costo =0;
        


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
          images:images,
          serviceName: serviceName,
          dummyseller: dummySeller,
          dummysellerId: dummySellerId,
          referredAt: new Date(),
          ...(review && { review })
    });

        await newPost.save();

        

        return res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updatePost = async (req, res) =>{
    try{
        const { postId } = req.params;
        const { desc, image } = req.body;

        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.desc = desc || post.desc;
        post.image = image || post.images;

        await post.save();

        return res.status(200).json({ message: "Post updated successfully", post });
    }
    catch (error){
        console.error("Error updating post:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
const removePost = async (req, res) => {
    try{
        const postId = req.params.id;
        const post = await Post.findByIdAndDelete(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json({ message: "Post removed successfully", post });
    }
    catch (error) { 
        console.error("Error removing post:", error);       
        return res.status(500).json({ message: "Internal server error" });    
    }           
    }

    const getPost = async (req, res) => {
        try{
            const postId = req.params;
            console.log("Post ID:", req.params);
            const post = await Post.findById(postId.postId).populate('serviceId').populate('sellerId').populate('dummysellerId');
            console.log("Post:", post);
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }
            return res.status(200).json({ post });

        }
        catch (error) {
            console.error("Error getting post:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    const getMyPosts = async(req,res)=>{
        try{
            const userId = req.user._id;
            console.log("User ID:", userId);
            const posts = await Post.find({ dummysellerId: userId })
                .populate('serviceId')
                .populate('sellerId')
                .populate('dummysellerId');
            return res.status(200).json({ posts });
        }
        catch (error) {
            console.error("Error getting my posts:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
    
const displayPost = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('serviceId')
            .populate('sellerId')
            .populate('dummysellerId');

        return res.status(200).json({ 
           
            posts 
        });
    } catch (error) {
        console.error("Error retrieving posts:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getPostByUser = async (req, res) => {
  try {
    const { userId } = req.body; // ✅ You’re sending it in body

    const posts = await Post.find({ dummysellerId: userId }) // or sellerId depending on your model
      .populate('serviceId')
      .populate('sellerId')
      .populate('dummysellerId');

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    return res.status(200).json({ posts });
  } catch (error) {
    console.error("Error retrieving posts by user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const uploadImages = (req, res) => {
    console.log(req.formDataUpload)
    console.log("images", req.files);
  try {
    console.log("uploading imagesss")
    const imageUrls = req.files.map(file => {
      return `https://appdev-production-bb12.up.railway.app/uploads/${file.filename}`;

    });

    console.log("Image URLs:", imageUrls);
    res.status(200).json({ success: true, imageUrls });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ success: false, message: 'Image upload failed.' });
  }
};

module.exports = {
    createPost,
    updatePost,
    removePost,
    getPost,
    getMyPosts,
    displayPost,
    getPostByUser,
    uploadImages 
};