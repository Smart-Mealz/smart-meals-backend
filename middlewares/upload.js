import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import config from "../utils/config.js";

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

export const mealkitImageUpload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "/mealkit/mealkit-image",
      // format: async (req, file) => "png", // supports promises as well
      public_id: (req, file) => file.originalname,
    },
  }),
});
