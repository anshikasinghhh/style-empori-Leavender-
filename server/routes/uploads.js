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
const upload = multer({ 
  storage, 
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

// POST /api/uploads - upload one or more images (staff only)
router.post('/', protect, staffOnly, upload.array('images', 50), async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length) return res.status(400).json({ success: false, message: 'No files provided' });
    
    // Check if Cloudinary credentials are present and valid
    const hasCloudinary = process.env.CLOUDINARY_API_KEY && 
                         process.env.CLOUDINARY_API_SECRET && 
                         process.env.CLOUDINARY_CLOUD_NAME && 
                         !process.env.CLOUDINARY_API_KEY.includes('your_');

    if (hasCloudinary) {
      try {
        const uploadPromises = files.map(file => new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'lavender-products', resource_type: 'auto' }, 
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        }));

        const results = await Promise.all(uploadPromises);
        const images = results.map(r => ({ 
          url: r.secure_url || r.url, 
          public_id: r.public_id,
          alt: ''
        }));
        return res.json({ success: true, images });
      } catch (cloudErr) {
        console.error('Cloudinary upload failed, falling back to local storage:', cloudErr.message);
        // Fall through to local storage
      }
    }

    // Fallback: save to local uploads folder
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const saved = files.map(file => {
      try {
        // Generate safe filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const ext = path.extname(file.originalname).toLowerCase();
        const baseName = file.originalname
          .replace(/[^a-z0-9]/gi, '-')
          .substring(0, 20)
          .toLowerCase();
        const safeName = `${timestamp}-${randomStr}-${baseName}${ext}`;
        
        const filePath = path.join(uploadsDir, safeName);
        fs.writeFileSync(filePath, file.buffer);
        
        // Construct full URL based on environment
        const protocol = req.protocol || 'http';
        const host = req.get('host') || 'localhost:5000';
        const url = `${protocol}://${host}/uploads/${safeName}`;
        
        console.log('File uploaded successfully:', url);
        
        return { 
          url, 
          public_id: null,
          alt: '',
          size: file.size,
          filename: safeName
        };
      } catch (fileErr) {
        console.error('Error saving file:', fileErr);
        throw new Error(`Failed to save file ${file.originalname}: ${fileErr.message}`);
      }
    });

    res.json({ success: true, images: saved });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: err.message || 'Upload failed' });
  }
});

// GET /api/uploads/test - Test if uploads directory is accessible
router.get('/test', (req, res) => {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  const exists = fs.existsSync(uploadsDir);
  res.json({ 
    success: true, 
    uploadsDir, 
    exists,
    message: exists ? 'Uploads directory exists' : 'Uploads directory does not exist'
  });
});

module.exports = router;
