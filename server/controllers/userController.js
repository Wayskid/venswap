import Businesses from "../models/BusinessModel.js";
import User from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { first_name, last_name, phone_number, email, password } = req.body;

    const phoneNumber = "234" + phone_number.replaceAll(/^0+(?!$)/g, "");

    //Check if phone number exists
    const user = await User.findOne({
      $or: [
        { "user_verifications.email.content": email },
        { "user_verifications.phone.content": phoneNumber },
      ],
    });
    if (user)
      throw new Error("This phone number or email is already registered");

    //Hash password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //Register user
    const newUser = await User.create({
      first_name,
      last_name,
      user_verifications: {
        phone: { content: phone_number, verified: true },
        email: { content: email, verified: false },
        email: { content: "", verified: false },
      },
      avatar: "",
      password: passwordHash,
    });

    res.status(201).send({
      userInfo: {
        _id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        user_verifications: newUser.user_verifications,
        avatar: newUser.avatar,
        isAdmin: newUser.isAdmin,
      },
      token: generateToken(newUser._id),
    });
  } catch (error) {
    res
      .status(500)
      .json(
        error.message ===
          "A user with this phone number or email already exists"
          ? error.message
          : "Something went wrong"
      );
  }
};

export const login = async (req, res) => {
  try {
    const { email_phone_number, password } = req.body;

    if (email_phone_number.includes("@")) {
      handleLogin(email_phone_number);
    } else {
      handleLogin("234" + email_phone_number.replaceAll(/^0+(?!$)/g, ""));
    }

    async function handleLogin(loginVal) {
      const user = await User.findOne({
        $or: [
          { "user_verifications.email.content": loginVal },
          { "user_verifications.phone.content": +loginVal },
        ],
      });

      //Invalid login details
      if (!user) throw new Error("Invalid login details");

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) throw new Error("invalid login details");

      if (user && isMatch) {
        res.status(200).json({
          userInfo: {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            user_verifications: user.user_verifications,
            avatar: user.avatar,
            isAdmin: user.isAdmin,
          },
          token: generateToken(user._id),
        });
      }
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const userInfo = async (req, res) => {
  try {
    const { user_id } = req.params;

    const userInfo = await User.findById(user_id);
    if (!userInfo) throw new Error("This user does not exist");

    res.status(200).send({
      _id: userInfo._id,
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      user_verifications: userInfo.user_verifications,
      avatar: userInfo.avatar,
      isAdmin: userInfo.isAdmin,
    });
  } catch (error) {
    res
      .status(400)
      .json(
        error.message === "This user does not exist"
          ? error.message
          : "Something went wrong"
      );
  }
};

export const editAvatar = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { avatar } = req.body;

    const user = await User.findById(user_id);
    if (!user) throw new Error("This user does not exist");

    user.avatar = avatar;
    const updatedUser = await user.save();

    res.status(200).send({
      _id: updatedUser._id,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      user_verifications: updatedUser.user_verifications,
      avatar: updatedUser.avatar,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (error) {
    res
      .status(400)
      .json(
        error.message === "This user does not exist"
          ? error.message
          : "Something went wrong"
      );
  }
};

export const editUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { first_name, last_name } = req.body;

    const user = await User.findById(user_id);
    if (!user) throw new Error("This user does not exist");

    user.first_name = first_name;
    user.last_name = last_name;

    const updatedUser = await user.save();

    res.status(200).send({
      _id: updatedUser._id,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      user_verifications: updatedUser.user_verifications,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (error) {
    res
      .status(400)
      .json(
        error.message === "This user does not exist" ||
          error.message === "This email has already been used"
          ? error.message
          : "Something went wrong"
      );
  }
};

export const changePassword = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { current_pass, new_pass } = req.body;

    const user = await User.findById(user_id);
    if (!user) throw new Error("Forbidden");

    const isMatch = await bcrypt.compare(current_pass, user.password);

    if (!isMatch) throw new Error("Incorrect password");

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(new_pass, salt);

    user.password = passwordHash;
    await user.save();

    res.status(200).send({
      isPassChanged: true,
    });
  } catch (error) {
    res
      .status(400)
      .json(
        error.message === "Forbidden" || error.message === "Incorrect password"
          ? error.message
          : "Something went wrong"
      );
  }
};

export const userProfile = async (req, res) => {
  try {
    const { first_name, user_id } = req.params;

    const userInfo = await User.findOne({ _id: user_id, first_name }).select(
      "-password -token"
    );
    if (!userInfo) throw new Error("Cannot find this user");

    const businesses = await Businesses.find({ seller_id: user_id }).select(
      "listing_details asking_price business_details.business_location"
    );
    if (!businesses) throw new Error("Business list is empty");

    res.status(200).send({
      userInfo,
      businesses,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
