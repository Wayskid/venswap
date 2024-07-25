import express from "express";
import {
  changePassword,
  editAvatar,
  editUser,
  login,
  register,
  userInfo,
  userProfile,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";
import {
  changePhone,
  verifyNewPhone,
  verifyPhone,
  verifyPhoneCode,
} from "../config/phoneVerification.js";
import {
  changeEmail,
  verifyEmail,
  verifyEmailCode,
  verifyNewEmail,
} from "../config/emailVerification.js";

const userRoute = express.Router();

// userRoute.get("/", verifyToken, async (req, res) => {
//   try {
//     const users = await Users.find({});
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });

//Register user
userRoute.post("/register", register);

//Verify phone
userRoute.post("/verify/phone_number", verifyPhone);

//Verify phone code
userRoute.post("/verify/code/phone_number", verifyPhoneCode);

//Change phone
userRoute.post("/change/phone_number/:user_id", verifyToken, changePhone);

//Verify new phone
userRoute.post(
  "/verify/new/phone_number/:user_id",
  verifyToken,
  verifyNewPhone
);

//Login user
userRoute.post("/login", login);

//Get user info
userRoute.get("/user_info/:user_id", verifyToken, userInfo);

//Edit user info
userRoute.patch("/edit_user/:user_id", verifyToken, editUser);

//Edit user avatar
userRoute.patch("/edit_avatar/:user_id", verifyToken, editAvatar);

//Edit user password
userRoute.patch("/change_password/:user_id", verifyToken, changePassword);

//Get user profile
userRoute.get("/profile/:first_name/:user_id", userProfile);

//Verify email
userRoute.post("/verify/email", verifyEmail);

//Verify email code
userRoute.post("/verify/code/email", verifyEmailCode);

//Change email
userRoute.post("/change/email/:user_id", verifyToken, changeEmail);

//Verify new email
userRoute.post("/verify/new/email/:user_id", verifyToken, verifyNewEmail);

export default userRoute;

//
//
//
//
//
//
//
//
//Launch

// const userLaunchSchema = mongoose.Schema(
//   {
//     name: {
//       type: String,
//       require: true,
//     },
//     email: {
//       type: String,
//       require: true,
//     },
//     phone_number: {
//       type: String,
//       require: true,
//     },
//     state: {
//       type: String,
//       require: true,
//     },
//     buy_or_sell: {
//       type: String,
//       require: true,
//     },
//     message: {
//       type: String,
//       require: true,
//     },
//   },
//   { timestamp: true }
// );
// const UserLaunch = mongoose.model("UserLaunch", userLaunchSchema);
// export const userLaunchRoute = express.Router();
// userLaunchRoute.get("/", async (req, res) => {
//   try {
//     const users = await UserLaunch.find({});
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(400).json(error.message);
//   }
// });
// userLaunchRoute.post("/create", async (req, res) => {
//   try {
//     const { name, email, phone_number, state, buy_or_sell, message } = req.body;

//     const user = await UserLaunch.create({
//       name,
//       email,
//       phone_number,
//       state,
//       buy_or_sell,
//       message,
//     });

//     res.status(201).json(user);
//   } catch (error) {
//     res.status(404).json(error.message);
//   }
// });
