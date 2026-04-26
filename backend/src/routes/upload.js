import { Router } from 'express';
import { parser } from '../config/cloudinary.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

router.post('/', verifyToken, parser.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // multer-storage-cloudinary attaches the secure URL to req.file.path
    res.json({ imageUrl: req.file.path });
  } catch (err) {
    res.status(500).json({ message: 'Server error during upload', error: err.message });
  }
});

export default router;
