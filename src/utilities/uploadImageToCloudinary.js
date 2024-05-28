import cloudinary from "../config/cloudinary.config.js";

const uploadImageToCloudinary = (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "alpha_store", // optional: specify a folder
        public_id: fileName.split(".")[0], // optional: specify a public ID
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    stream.end(fileBuffer);
  });
};

export default uploadImageToCloudinary;
