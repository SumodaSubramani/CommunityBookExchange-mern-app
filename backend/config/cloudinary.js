const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary with your credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to store files in memory temporarily before uploading
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to upload a file to Cloudinary
const uploadToCloudinary = (req, res, next) => {
  // Use the 'image' field name from your form
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'Image upload failed', error: err });
    }
    if (!req.file) {
      // If no file is provided, just move to the next middleware
      return next();
    }
    
    // Upload the file from buffer to Cloudinary
    const stream = cloudinary.uploader.upload_stream({ folder: "book-exchange" }, (error, result) => {
      if (error) {
        return res.status(500).json({ message: 'Cloudinary upload failed', error });
      }
      // Attach the Cloudinary URL to the request object
      req.file.path = result.secure_url;
      next();
    });
    
    stream.end(req.file.buffer);
  });
};

module.exports = { uploadToCloudinary };