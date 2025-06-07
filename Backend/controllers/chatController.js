const { Model } = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');

const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    console.log("Sender ID:", senderId);
    const { receiverId, content } = req.body;
    console.log("Receiver ID:", receiverId);
    const message = await Message.create({ sender: senderId, receiver: receiverId, content });
    console.log(message)
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    console.log("Sender:", sender);
    console.log("Receiver:", receiver);
    sender.chats.push( message );
    console.log("Sender Chats:", sender.chats);
    receiver.chats.push(message );
    await sender.save();
    await receiver.save();
    res.status(201).json({ success: true, message });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.user._id; // logged-in user
    const friendId = req.params.friendId; // target user

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId }
      ]
    }).sort({ timestamp: -1 }); 

    return res.status(200).json({ success: true, messages });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Failed to retrieve messages' });
  }
};

module.exports = {
  sendMessage,
  getMessages
};
