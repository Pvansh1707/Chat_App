// const asyncHandler = require("express-async-handler");
// const Message = require("../models/messageModel");
// const User = require("../models/userModel");
// const Chat = require("../models/chatModel");

// //@description     Get all Messages
// //@route           GET /api/Message/:chatId
// //@access          Protected
// const allMessages = asyncHandler(async (req, res) => {
//   try {
//     const messages = await Message.find({ chat: req.params.chatId })
//       .populate("sender", "name pic email")
//       .populate("chat");
//     res.json(messages);
//   } catch (error) {
//     res.status(400);
//     throw new Error(error.message);
//   }
// });

// //@description     Create New Message
// //@route           POST /api/Message/
// //@access          Protected
// const sendMessage = asyncHandler(async (req, res) => {
//   const { content, chatId } = req.body;

//   if (!content || !chatId) {
//     console.log("Invalid data passed into request");
//     return res.sendStatus(400);
//   }

//   var newMessage = {
//     sender: req.user._id,
//     content: content,
//     chat: chatId,
//   };

//   try {
//     var message = await Message.create(newMessage);

//     message = await message.populate("sender", "name pic").execPopulate();
//     message = await message.populate("chat").execPopulate();
//     message = await User.populate(message, {
//       path: "chat.users",
//       select: "name pic email",
//     });

//     await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

//     res.json(message);
//   } catch (error) {
//     res.status(400);
//     throw new Error(error.message);
//   }
// });

// module.exports = { allMessages, sendMessage };


const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

// @desc    Get all Messages
// @route   GET /api/message/:chatId
// @access  Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Create New Message
// @route   POST /api/message/
// @access  Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  // 🛑 Check for missing content or chatId
  if (!content || !chatId) {
    console.log("Invalid data passed into request:", { content, chatId });
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    // ✅ Modern population
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    // ✅ Update latest message in the chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
