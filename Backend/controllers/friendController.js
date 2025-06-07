const User = require('../models/User'); 

 const sendFriendRequest = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { receiverId } = req.body;
    const senderId = req.user._id; 
    console.log("Sender ID:", senderId);
    console.log("Receiver ID:", receiverId);

    if (senderId === receiverId) {
      return res.status(400).json({ error: "Seriously!! is your education graduation" });
    }

    
    const receiver = await User.findById(receiverId);
 
   
    if (receiver.friendsRequests.includes(senderId)) {
      return res.status(400).json({ message: "Request already sent." });
    }

    if (receiver.friends.includes(senderId)) {
      return res.status(400).json({ message: "Already friends." });
    }
    receiver.friendsRequests.push(senderId);
    console.log(receiver.friendsRequests);
    await receiver.save();

    res.json({ message: 'Friend request sent' });
  } catch (err) {
    res.status(500).json({ error: 'Error sending friend request' });
    console.error("Error in sendFriendRequest:", err);
  }
};

 const acceptFriendRequest = async (req, res) => {
  try {
    const { senderId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const sender = await User.findById(senderId);

    if (!user.friendsRequests.includes(senderId)) {
      return res.status(400).json({ error: "No such friend request found" });
    }

    
    user.friends.push(senderId);
    sender.friends.push(userId);

   
    user.friendsRequests = user.friendsRequests.filter(id => id.toString() !== senderId);

    await user.save();
    await sender.save();

    res.json({ message: 'Friend request accepted' });
  } catch (err) {
    res.status(500).json({ error: 'Error accepting friend request' });
  }
};

 const rejectFriendRequest = async (req, res) => {
  try {
    const { senderId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    user.friendsRequests = user.friendsRequests.filter(id => id.toString() !== senderId);

    await user.save();

    res.json({ message: 'Friend request rejected' });
  } catch (err) {
    res.status(500).json({ error: 'Error rejecting friend request' });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friendsRequests', 'name email');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
 console.log("Friend requests for user:", user.friendsRequests);
    res.json({ requests: user.friendsRequests });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching friend requests' });
  }
};
const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', 'name email');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(" Friends of user:", user.friends);
    res.json({ friends: user.friends });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching friends list' });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getFriends
};

