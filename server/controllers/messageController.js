import Chats from "../models/chatModel.js";
import Messages from "../models/messageModel.js";
import Payments from "../models/paymentModel.js";

export const getMessages = async (req, res) => {
  try {
    const { chat_id } = req.params;

    const messages = await Messages.find({
      chat_id,
    })
      .populate("sender_id", "-password")
      .populate("chat_id");

    if (!messages.length) throw new Error("Message list is empty");

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const createMessage = async (req, res) => {
  try {
    const { sender_id } = req.params;
    const { content, chat_id, payment_info, is_payment } = req.body;

    //Create message
    const newMessage = await Messages.create({
      sender_id,
      content,
      chat_id,
      payment_info,
      is_payment,
    });

    //Modify latest message
    const chatModified = await Chats.findById(chat_id);
    chatModified.latest_message = newMessage._id;
    await chatModified.save();
    const updatedChat = await Chats.findById(chat_id)
      .populate("users", "-password")
      .populate("latest_message");
    const message = await Messages.findById(newMessage._id)
      .populate("sender_id", "-password")
      .populate("chat_id");

    res.status(200).json({ message, updatedChat });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const editOfferMessage = async (req, res) => {
  try {
    const { sender_id, message_id } = req.params;

    const message = await Messages.findById(message_id);

    if (message.sender_id.toHexString() !== sender_id)
      throw new Error("Access denied");

    //Modify latest message
    message.payment_info.status = "withdrawn";
    const modifiedMessage = await message.save();
    const updated_message = await Messages.findById(modifiedMessage._id)
      .populate("sender_id", "-password")
      .populate("chat_id");

    res.status(200).json(updated_message);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { message_id, payment_id } = req.params;

    const payment = await Payments.findById(payment_id);
    const message = await Messages.findById(message_id);

    if (payment.payment_info.status === "success")
      message.payment_info.status = "paid";
    const modifiedMessage = await message.save();
    const updated_message = await Messages.findById(modifiedMessage._id)
      .populate("sender_id", "-password")
      .populate("chat_id");

    res.status(200).json(updated_message);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const readMessage = async (req, res) => {
  try {
    const { message_id } = req.params;

    const message = await Messages.findById(message_id);

    if (message.isRead === false) message.isRead = true;
    const modifiedMessage = await message.save();
    const updated_message = await Messages.findById(modifiedMessage._id)
      .populate("sender_id", "-password")
      .populate("chat_id");

    res.status(200).json(updated_message);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
