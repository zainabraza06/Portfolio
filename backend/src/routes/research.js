import { Router } from 'express';
import { getResearch, createResearch, updateResearch, deleteResearch, reorderResearch } from '../controllers/researchController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();
router.get('/', getResearch);
router.patch('/reorder', verifyToken, reorderResearch);
router.post('/', verifyToken, createResearch);
router.put('/:id', verifyToken, updateResearch);
router.delete('/:id', verifyToken, deleteResearch);

export default router;
