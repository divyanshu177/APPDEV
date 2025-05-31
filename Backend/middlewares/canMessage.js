const Post = require('../models/post');
const User = require('../models/User');

const canMessage = async (req, res, next) => {
  const { senderId, receiverId } = req.body;

  // Check if they are friends
  const sender = await User.findById(senderId);
  if (sender.friends.includes(receiverId)) return next();

  // Check if receiver has posted something
  const post = await Post.findOne({ createdBy: receiverId });
  if (post) return next();

  return res.status(403).json({ message: 'You are not allowed to message this user.' });
};

module.exports = canMessage;
