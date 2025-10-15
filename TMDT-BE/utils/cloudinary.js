// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
  cloud_name: 'dm8ydkx0k',
  api_key: '789694356734282',
  api_secret: '3V3ihOhTQxGfmj3NWNF9OH_ef5Y',
});

// console.log("✅ Cloudinary config loaded:", cloudinary.config());

export default cloudinary;
