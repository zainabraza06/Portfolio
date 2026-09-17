import { Router } from 'express';
import { getFreelance, createFreelance, updateFreelance, deleteFreelance, reorderFreelance } from '../controllers/freelanceController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();
router.get('/', getFreelance);
router.post('/', verifyToken, createFreelance);
router.patch('/reorder', verifyToken, reorderFreelance);
router.put('/:id', verifyToken, updateFreelance);
router.delete('/:id', verifyToken, deleteFreelance);

export default router;
