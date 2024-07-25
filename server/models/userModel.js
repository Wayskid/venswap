import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      require: true,
    },
    last_name: {
      type: String,
      require: true,
    },
    user_verifications: {
      email: {
        content: {
          type: String,
          require: true,
          unique: true,
        },
        verified: {
          type: Boolean,
          require: true,
          default: false,
        },
      },
      phone: {
        content: {
          type: String,
          require: true,
          unique: true,
        },
        verified: {
          type: Boolean,
          require: true,
          default: false,
        },
      },
      ID: {
        content: {
          type: String,
          unique: true,
        },
        verified: {
          type: Boolean,
          require: true,
          default: false,
        },
      },
    },
    avatar: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      require: true,
    },
    isAdmin: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);

export default Users;
