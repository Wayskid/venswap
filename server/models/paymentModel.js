import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
  {
    amount_details: {
      amount: {
        type: Number,
        require: true,
      },
      tax: {
        type: Number,
      },
      escrow_fee: {
        type: Number,
        require: true,
      },
      total_amount: {
        type: Number,
        require: true,
      },
    },
    users: {
      payment_from: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "Users",
      },
      payment_to: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "Users",
      },
    },
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Businesses",
    },
    message_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Messages",
    },
    chat_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Chats",
    },
    payment_info: {
      type: Object,
      require: true,
    },
  },
  { timestamps: true }
);

const Payments = mongoose.model("Payments", paymentSchema);

export default Payments;
