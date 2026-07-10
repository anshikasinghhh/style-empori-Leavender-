const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const fs = require('fs');
const path = require('path');
const { protect } = require('../middleware/auth');
const { staffOnly } = require('../middleware/staff');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 } });

// POST /api/uploads - upload one or more images (staff only)
router.post('/', protect, staffOnly, upload.array('images', 50), async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length) return res.status(400).json({ success: false, message: 'No files provided' });
    // If Cloudinary credentials are present, use Cloudinary; otherwise fallback to local storage
    const hasCloudinary = process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET && process.env.CLOUDINARY_CLOUD_NAME && !process.env.CLOUDINARY_API_KEY.includes('your_');

    if (hasCloudinary) {
      const uploadPromises = files.map(file => new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      }));

      const results = await Promise.all(uploadPromises);
      const images = results.map(r => ({ url: r.secure_url || r.url, public_id: r.public_id }));
      return res.json({ success: true, images });
    }

    // Fallback: save to local uploads folder
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const saved = files.map(file => {
      const safeName = Date.now() + '-' + file.originalname.replace(/[^a-z0-9.\-_]/gi, '-');
      const filePath = path.join(uploadsDir, safeName);
      fs.writeFileSync(filePath, file.buffer);
      return { url: `${req.protocol}://${req.get('host')}/uploads/${safeName}`, public_id: null };
    });
    return res.json({ success: true, images: saved });
  } catch (err) {
    console.error('Upload error', err);
    res.status(500).json({ success: false, message: err.message || 'Upload failed' });
  }
});

module.exports = router;
