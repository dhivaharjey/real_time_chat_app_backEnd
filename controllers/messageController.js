import Message from "../model/messageSchema.js";
import User from "../model/userSchema.js";
import { getSocketId, io } from "../Socket/socket.js";

export const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user?._id;
    const allUsers = await User.find({ _id: { $ne: currentUserId } });

    return res.status(200).json(allUsers);
  } catch (error) {
    console.log("error to get all users", error);

    return res
      .status(500)
      .json({ message: error?.message || "Inernal Server Error " });
  }
};

export const getUserChatHistory = async (req, res) => {
  try {
    const userIdToChat = req.params?.id;
    const currentUserId = req.user?._id;
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userIdToChat },
        {
          senderId: userIdToChat,
          receiverId: currentUserId,
        },
      ],
    });
    return res.status(200).json(messages);
  } catch (error) {
    console.log("error to get one on one chat messages", error);

    return res
      .status(500)
      .json({ message: error?.message || "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    // console.log(req.body);

    const { text, image } = req.body;
    // console.log(text, image);

    const receiverId = req.params.id;
    const senderId = req.user?._id; // current user id
    // let imageUrl;
    // if (image) {
    //   const res = await uploadCloudinary(image);
    //   imageUrl = res;
    // }
    //video or audio handling goes here...
    const newMessage = await Message.create({
      senderId,
      receiverId,
      textMessage: text,
      //   image: imageUrl,
      image,
    });
    const receiverSocketId = getSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return res.status(201).json(newMessage);
  } catch (error) {
    console.log("error to send message", error);
    return res
      .status(500)
      .json({ message: error?.message || "Internal Server Error" });
  }
};
