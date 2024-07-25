import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

export function deleteImage(req, res) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  cloudinary.uploader
    .destroy(req.body.public_id)
    .then((result) => res.status(200).json(result));
}

export function signUpload(req, res) {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      folder: req.body.folder,
      tags: req.body.tags,
    },
    process.env.CLOUDINARY_API_SECRET
  );
  res.status(200).json({
    signature,
    timestamp,
  });
}
