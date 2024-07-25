import express from "express";
import aws from "aws-sdk";
import dotenv from "dotenv";
import bycrypt from "bcrypt";

dotenv.config();

const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

export default async function generateUploadURL(key) {
  const rawBytes = await bycrypt.genSalt(16);
  const fileName = rawBytes.toString("hex").replace(/[^a-zA-Z ]/g, "");

  const params = {
    Bucket: bucketName,
    Key: `${key}-${fileName}.pdf`,
    Expires: 60,
    ContentType: "application/pdf",
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);
  return uploadURL;
}

export async function getSignBucket(req, res) {
  const { key } = req.body;
  const url = await generateUploadURL(key);
  res.send({ url });
}
