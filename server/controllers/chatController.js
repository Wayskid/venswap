import Chats from "../models/chatModel.js";

export const getChats = async (req, res) => {
  try {
    const { user_id } = req.params;

    const chats = await Chats.find({
      users: { $all: [user_id] },
    })
      .populate("users", "-password")
      .populate("business_id", "listing_details seller_id")
      .populate("latest_message");

    if (!chats.length) throw new Error("Chat list is empty");

    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const getOneChat = async (req, res) => {
  try {
    const { user_id, chat_id } = req.params;

    const chat = await Chats.findOne({
      _id: chat_id,
      users: { $all: [user_id] },
    })
      .populate("users", "-password")
      .populate("business_id", "listing_details seller_id")
      .populate("latest_message");

    if (!chat) throw new Error("Chat is not available");

    res.status(200).json(chat);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const createChat = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { seller_id, business_id } = req.body;

    //Check if you're messaging yourself
    if (user_id === seller_id) throw new Error("You can't contact yourself");

    //Check if chat exists
    const chatExists = await Chats.findOne({
      users: { $all: [user_id, seller_id] },
      business_id,
    });

    if (chatExists) throw new Error("Chat Exists " + chatExists._id);

    //Create chat
    const newChat = await Chats.create({
      users: [user_id, seller_id],
      business_id,
    });

    //Populate
    const updatedChat = await Chats.findById(newChat._id)
      .populate("users", "-password")
      .populate("business_id", "listing_details seller_id")
      .populate("latest_message");

    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
