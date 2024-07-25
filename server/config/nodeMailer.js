// import nodemailer from "nodemailer";
// import {
//   mindsetFree,
//   mindsetPrem,
//   strategyFree,
//   strategyPrem,
//   innovationFree,
//   innovationPrem,
//   executionFree,
//   executionPrem,
// } from "../utils/emails/email.js";
// import dotenv from "dotenv";
// dotenv.config();

// const NodeMailer = async ({ id, name, email, concept, level, plan }) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.MAILER_HOST,
//     secureConnection: true,
//     port: 465,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   let mail = {};
//   switch (true) {
//     case plan === "Free" && concept === "Mindset":
//       mail = { conceptMail: mindsetFree, subject: "Mindset & Culture" };
//       break;
//     case plan === "Premium" && concept === "Mindset":
//       mail = { conceptMail: mindsetPrem, subject: "Mindset & Culture" };
//       break;
//     case plan === "Free" && concept === "Strategy":
//       mail = { conceptMail: strategyFree, subject: "Strategy & Change" };
//       break;
//     case plan === "Premium" && concept === "Strategy":
//       mail = { conceptMail: strategyPrem, subject: "Strategy & Change" };
//       break;
//     case plan === "Free" && concept === "Innovation":
//       mail = { conceptMail: innovationFree, subject: "Innovation & Analytics" };
//       break;
//     case plan === "Premium" && concept === "Innovation":
//       mail = { conceptMail: innovationPrem, subject: "Innovation & Analytics" };
//       break;
//     case plan === "Free" && concept === "Execution":
//       mail = { conceptMail: executionFree, subject: "Execution & Agility" };
//       break;
//     case plan === "Premium" && concept === "Execution":
//       mail = {
//         conceptMail: executionPrem,
//         subject: "Execution & Agility",
//       };
//       break;
//     default:
//       mail = "";
//       break;
//   }

//   const info = await transporter.sendMail({
//     from: `Tom Hunsaker <${process.env.EMAIL_USERNAME}>`,
//     to: email,
//     subject: `${mail?.subject} Assessment`,
//     html: mail.conceptMail({ id, concept, name, level }),
//   });

//   console.log(`Message sent: ${info.messageId}`);
// };

// export default NodeMailer;
