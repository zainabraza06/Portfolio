import { Router } from 'express';
import { getKaggle, createKaggle, updateKaggle, deleteKaggle, reorderKaggle } from '../controllers/kaggleController.js';
import { verifyToken } from '../middlewares/auth.js';
import { parser } from '../config/cloudinary.js';

const router = Router();
router.get('/', getKaggle);
router.post('/', verifyToken, parser.single('image'), createKaggle);
router.patch('/reorder', verifyToken, reorderKaggle);
router.put('/:id', verifyToken, parser.single('image'), updateKaggle);
router.delete('/:id', verifyToken, deleteKaggle);

export default router;
