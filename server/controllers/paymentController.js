import Payments from "../models/paymentModel.js";

export const getUserPayments = async (req, res) => {
  try {
    const { user_id } = req.params;

    const payments = await Payments.find({ "users.payment_to": user_id });

    if (!payments.length) throw new Error("Chat list is empty");

    res.status(200).json(payments);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const createPayment = async (req, res) => {
  try {
    const { user_id, business_id } = req.params;
    const { amount_details, message_id, chat_id, payment_info, seller_id } =
      req.body;

    //Create payment
    const newPayment = await Payments.create({
      amount_details,
      users: { payment_from: user_id, payment_to: seller_id },
      business_id,
      message_id,
      chat_id,
      payment_info,
    });

    //Populate
    const updatedPayment = await Payments.findById(newPayment._id)
      .populate("users.payment_from", "-password")
      .populate("users.payment_to", "-password")
      .populate("business_id", "listing_details seller_id");

    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
