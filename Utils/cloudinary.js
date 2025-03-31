import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadCloudinary = async (data) => {
  try {
    const res = await cloudinary.uploader.upload(data, {
      upload_preset: "chat-app",
    });
    return res?.secure_url;
  } catch (error) {
    console.log(error);
    return error?.message;
  }
};
