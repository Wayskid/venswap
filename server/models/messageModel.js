import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Users",
    },
    content: {
      message_text: {
        type: String,
      },
      message_images: {
        type: Array,
      },
      message_files: {
        type: Array,
      },
    },
    is_payment: {
      type: Boolean,
      require: true,
      default: false,
    },
    payment_info: {
      payment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payments",
      },
      amount_details: {
        amount: {
          type: Number,
        },
        tax: {
          type: Number,
        },
        escrow_fee: {
          type: Number,
        },
        discount: {
          type: Number,
          default: 0,
        },
        total_amount: {
          type: Number,
        },
      },
      status: {
        type: String,
        require: true,
        default: "pending",
      },
      offer_description: {
        type: String,
      },
      business_details: {
        business_title: {
          type: String,
        },
        business_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Businesses",
        },
      },
    },
    chat_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Chats",
    },
    isRead: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Messages = mongoose.model("Messages", messageSchema);

export default Messages;
