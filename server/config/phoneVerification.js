import twilio from "twilio";
import Users from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import dotenv from "dotenv";

dotenv.config();

const authToken = process.env.VERIFICATION_AUTH_TOKEN;
const accountSid = process.env.VERIFICATION_ACCOUNT_SID;
const services = process.env.VERIFICATION_SERVICE;
const client = twilio(accountSid, authToken);

export async function verifyPhone(req, res) {
  try {
    const { phone_number } = req.body;

    const phoneNumber = "234" + phone_number.replaceAll(/^0+(?!$)/g, "");

    const phoneExists = await Users.findOne({
      "user_verifications.phone.content": phoneNumber,
    });

    if (phoneExists) throw new Error("This phone number is already registered");

    client.verify.v2
      .services(services)
      .verifications.create({ to: `+${phoneNumber}`, channel: "sms" })
      .then((verification) => res.status(200).json(verification.sid));
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export function verifyPhoneCode(req, res) {
  const { code, sid } = req.body;

  client.verify.v2
    .services(services)
    .verificationChecks.create({ verificationSid: sid, code })
    .then((verification_check) =>
      res.status(200).json(verification_check.status)
    )
    .catch((error) => res.status(400).json(error));
}

export async function changePhone(req, res) {
  try {
    const { oldPhone, newPhone } = req.body;
    const { user_id } = req.params;

    const phoneNumber = "234" + newPhone.replaceAll(/^0+(?!$)/g, "");
    const oldPhoneNumber = "234" + oldPhone.replaceAll(/^0+(?!$)/g, "");

    const user = await Users.findById(user_id);
    if (!user) throw new Error("Something went wrong");
    if (user.user_verifications.phone.content !== oldPhoneNumber)
      throw new Error("Wrong old phone number");
    const phoneExists = await Users.findOne({
      "user_verifications.phone.content": phoneNumber,
    });
    if (phoneExists) throw new Error("This phone number is already registered");

    client.verify.v2
      .services(services)
      .verifications.create({ to: `+${phoneNumber}`, channel: "sms" })
      .then((verification) => res.status(200).json(verification.sid));
  } catch (err) {
    res.status(400).json(err.message);
  }
}

export async function verifyNewPhone(req, res) {
  const { newPhone, code, sid } = req.body;
  const { user_id } = req.params;

  const phoneNumber = "234" + newPhone.replaceAll(/^0+(?!$)/g, "");

  const user = await Users.findById(user_id);
  if (!user) throw new Error("Something went wrong");

  client.verify.v2
    .services(services)
    .verificationChecks.create({ verificationSid: sid, code })
    .then(async (verification_check) => {
      if (verification_check.status === "approved") {
        user.user_verifications.phone.content = phoneNumber;
        user.user_verifications.phone.verified = true;
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
      }
    })
    .catch((error) => res.status(400).json(error));
}
