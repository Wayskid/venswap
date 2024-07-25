import twilio from "twilio";
import Users from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import dotenv from "dotenv";

dotenv.config();

const authToken = process.env.VERIFICATION_AUTH_TOKEN;
const accountSid = process.env.VERIFICATION_ACCOUNT_SID;
const services = process.env.VERIFICATION_SERVICE;
const client = twilio(accountSid, authToken);

export async function verifyEmail(req, res) {
  try {
    const { email_to, user_id } = req.body;

    const user = await Users.findOne({
      _id: user_id,
      "user_verifications.email.content": email_to,
    });

    if (!user) throw new Error("Something went wrong");

    await client.verify.v2
      .services(services)
      .verifications.create({
        channel: "email",
        to: email_to,
      })
      .then((verification) => res.status(200).json(verification.sid));
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export async function verifyEmailCode(req, res) {
  const { user_id, email, code, sid } = req.body;

  const user = await Users.findById(user_id);
  if (!user) throw new Error("Something went wrong");

  await client.verify.v2
    .services(services)
    .verificationChecks.create({ verificationSid: sid, code })
    .then(async (verification_check) => {
      if (verification_check.status === "approved") {
        user.user_verifications.email.content = email;
        user.user_verifications.email.verified = true;
        const updatedUser = await user.save();

        res.status(200).json({
          userInfo: {
            _id: updatedUser._id,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            user_verifications: updatedUser.user_verifications,
            avatar: updatedUser.avatar,
            isAdmin: updatedUser.isAdmin,
          },
          token: generateToken(updatedUser._id),
        });
      } else {
        throw new Error("Invalid code");
      }
    })
    .catch((error) => res.status(400).json(error));
}

export async function changeEmail(req, res) {
  try {
    const { old_email, new_email } = req.body;
    const { user_id } = req.params;

    const user = await Users.findById(user_id);
    if (!user) throw new Error("Something went wrong");
    if (user.user_verifications.email.content !== old_email)
      throw new Error("Invalid old email");
    const emailExists = await Users.findOne({
      "user_verifications.email.content": new_email,
    });
    if (emailExists) throw new Error("This email is already registered");

    await client.verify.v2
      .services(services)
      .verifications.create({
        channel: "email",
        to: new_email,
      })
      .then((verification) => res.status(200).json(verification.sid));
  } catch (err) {
    res.status(400).json(err.message);
  }
}

export async function verifyNewEmail(req, res) {
  const { new_email, code, sid } = req.body;
  const { user_id } = req.params;

  const user = await Users.findById(user_id);
  if (!user) throw new Error("Something went wrong");

  await client.verify.v2
    .services(services)
    .verificationChecks.create({ verificationSid: sid, code })
    .then(async (verification_check) => {
      if (verification_check.status === "approved") {
        user.user_verifications.email.content = new_email;
        user.user_verifications.email.verified = true;
        const updatedUser = await user.save();

        res.status(200).json({
          userInfo: {
            _id: updatedUser._id,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            user_verifications: updatedUser.user_verifications,
            avatar: updatedUser.avatar,
            isAdmin: updatedUser.isAdmin,
          },
          token: generateToken(updatedUser._id),
        });
      } else {
        throw new Error("Invalid code");
      }
    })
    .catch((error) => res.status(400).json(error));
}
