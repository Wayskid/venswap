import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/mongoose.js";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import businessRoute from "./routes/businessRoute.js";
import socketConnect from "./config/socket.js";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { getSignBucket } from "./config/bucket.js";
import paymentRouter from "./routes/paymentRoute.js";
import reportRoute from "./routes/reportRoute.js";
import { deleteImage, signUpload } from "./config/cloudinary.js";
import { verifyToken } from "./middleware/auth.js";
import { errorHandler, notFound } from "./middleware/error.js";
import analyticsRoute from "./routes/analyticsRoute.js";

dotenv.config();
connectDB();
const app = express();
const options = {
  origin: ["http://localhost:5173", process.env.CLIENT_URL],
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  optionSuccessStatus: 204,
  preflightContinue: false,
};
const server = http.createServer(app);
socketConnect(server, options);

//Body parser and CORS
app.use(
  bodyParser.json({
    verify: function (req, res, buf) {
      req.rawBody = buf;
    },
    limit: "50mb",
    extended: true,
  })
);

app.use(cors(options));

//Api Routes
app.use("/api/user", userRoute);
app.use("/api/business", businessRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use("/api/analytics", analyticsRoute);
app.use("/api/payment", paymentRouter);
app.use("/api/report", reportRoute);

// app.use("/api/addAvatar", async (req, res) => {
//   try {
//     const updated = await Users.updateMany(
//       {},
//       {
//         $set: {
//           user_verifications: {
//             email: { content: "", verified: false },
//             phone: { content: "", verified: false },
//             ID: { content: "", verified: false },
//           },
//         },
//       },
//       { upsert: true }
//     );

//     res.status(200).json(updated);
//   } catch (err) {
//     res.status(400).json(err.message);
//   }
// });

//Bucket route
app.use("/api/s3Url", verifyToken, getSignBucket);

//Cloudinary
app.use("/api/signUploadRoute", verifyToken, signUpload);
app.use("/api/delete_image", verifyToken, deleteImage);

//Error middleware
//Not found
app.all("*", notFound);
app.use(errorHandler);

server.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT}`)
);
