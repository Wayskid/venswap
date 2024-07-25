// import Stripe from "stripe";
// import express from "express";
// import dotenv from "dotenv";
// import NodeMailer from "./nodeMailer.js";
// import MindsetUsers from "../models/mindsetUsersModel.js";
// import StrategyUsers from "../models/strategyUsersModel.js";
// import InnovationUsers from "../models/innovationUsersModel.js";
// import ExecutionUsers from "../models/executionUsersModel.js";

// dotenv.config();

// const stripe = Stripe(process.env.STRIPE_KEY);
// const endpointSecret = process.env.STRIPE_SECRET;
// export const stripeRouter = express.Router();

// //-----------Payment Checkout----------------
// stripeRouter.post("/create-checkout-session", async (req, res) => {
//   const {
//     business_id,
//     amount_details,
//     users: { payment_from, payment_to },
//   } = req.body;

//   const customer = await stripe.customers.create({
//     metadata: {
//       business_id,
//       users: { payment_from, payment_to },
//       message_id,
//       chat_id,
//     },
//   });

//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: "Mindset & Culture SHAPER Report",
//             description: "Your premier business attractiveness scorecard",
//           },
//           unit_amount: (49 * 100).toFixed(0),
//         },
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     customer: customer.id,
//     success_url: `${process.env.CLIENT_URL}/assessment/mindset/paid_success`,
//     cancel_url: `${process.env.CLIENT_URL}/assessment/mindset/paid`,
//   });

//   res.json({ url: session.url });
// });

// //Payment Webhook
// stripeRouter.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   async (request, response) => {
//     const sig = request.headers["stripe-signature"];
//     let event;

//     try {
//       event = stripe.webhooks.constructEvent(
//         request.rawBody,
//         sig,
//         endpointSecret
//       );
//       console.log("Webhook verified");
//     } catch (err) {
//       response.status(400).send(`Webhook Error: ${err.message}`);
//       return;
//     }

//     // Handle the event
//     switch (event.type) {
//       case "checkout.session.completed":
//         const checkoutSessionCompleted = event.data.object;
//         const {
//           id,
//           amount_subtotal,
//           amount_total,
//           created,
//           currency,
//           customer,
//           customer_details,
//           payment_method_types,
//           payment_status,
//           total_details,
//         } = checkoutSessionCompleted;

//         const session = await stripe.checkout.sessions.retrieve(
//           checkoutSessionCompleted.id,
//           {
//             expand: ["customer"],
//           }
//         );

//         const mindsetUser = await MindsetUsers.findOne({
//           name: session.customer.metadata.name,
//           email: session.customer.metadata.email,
//         });

//         mindsetUser.plan = "Premium";
//         mindsetUser.paymentInfo = {
//           session_id: id,
//           amount_subtotal,
//           amount_total,
//           created,
//           currency,
//           customer,
//           customer_details,
//           payment_method_types,
//           payment_status,
//           total_details,
//         };

//         let levelImage = {};
//         switch (true) {
//           case mindsetUser.level === 1:
//             levelImage = {
//               desktop:
//                 "https://mcusercontent.com/91d753cf1db5228f650c8546a/images/5b1911f0-6cc4-e8a4-fac3-06f17b608d8a.png",
//               mobile:
//                 "https://mcusercontent.com/91d753cf1db5228f650c8546a/images/0aa76ff5-9105-e493-f4f1-de2a22a0ffff.png",
//             };
//             break;
//           case mindsetUser.level === 2:
//             levelImage = {
//               desktop:
//                 "https://mcusercontent.com/91d753cf1db5228f650c8546a/images/9e3c49b5-556d-66c7-a8e9-9ffb64d22695.png",
//               mobile:
//                 "https://mcusercontent.com/91d753cf1db5228f650c8546a/images/76b2dafe-9366-cfb1-7787-cbbc7ea0ed3d.png",
//             };
//             break;
//           case mindsetUser.level === 3:
//             levelImage = {
//               desktop:
//                 "https://mcusercontent.com/91d753cf1db5228f650c8546a/images/e0c9ebae-2423-ede3-bbd3-79e7514d1c9c.png",
//               mobile:
//                 "https://mcusercontent.com/91d753cf1db5228f650c8546a/images/fa2b849b-2c63-dd27-723d-dec89a42275e.png",
//             };
//             break;
//           case mindsetUser.level === 4:
//             levelImage = {
//               desktop:
//                 "https://mcusercontent.com/91d753cf1db5228f650c8546a/images/b145599d-b54d-647a-26f8-722d7e701e5f.png",
//               mobile:
//                 "https://mcusercontent.com/91d753cf1db5228f650c8546a/images/36609bba-6ced-f589-f9f0-b52945cca5d7.png",
//             };
//             break;
//           case mindsetUser.level === 5:
//             levelImage = {
//               desktop:
//                 "https://mcusercontent.com/91d753cf1db5228f650c8546a/images/8f3f6dec-0cd2-1dd5-ff56-2a55a884db88.png",
//               mobile:
//                 "https://mcusercontent.com/91d753cf1db5228f650c8546a/images/77440b0e-bfe1-79ff-5943-d05577d78684.png",
//             };
//             break;
//           default:
//             levelImage = {
//               desktop:
//                 "https://mcusercontent.com/91d753cf1db5228f650c8546a/images/5b1911f0-6cc4-e8a4-fac3-06f17b608d8a.png",
//               mobile:
//                 "https://mcusercontent.com/91d753cf1db5228f650c8546a/images/0aa76ff5-9105-e493-f4f1-de2a22a0ffff.png",
//             };
//             break;
//         }

//         await mindsetUser.save();
//         NodeMailer({
//           id: mindsetUser._id,
//           name: mindsetUser.name,
//           email: mindsetUser.email,
//           concept: "Mindset",
//           level: levelImage,
//           plan: "Premium",
//         });

//       default:
//         console.log(`Unhandled event type ${event.type}`);
//     }

//     response.send().end();
//   }
// );
