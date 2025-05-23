const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (image) => {
  try {
    const result = await cloudinary.uploader.upload(image, {
      resource_type: "image"
    });
    return { secure_url: result.secure_url };
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    throw new Error('Image upload failed');
  }
};

module.exports = { cloudinary, uploadImage };
