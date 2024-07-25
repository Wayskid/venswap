import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "Users",
      },
    ],
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Businesses",
    },
    latest_message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages",
    },
  },
  { timestamps: true }
);

const Chats = mongoose.model("Chats", chatSchema);

export default Chats;
