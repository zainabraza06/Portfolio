import { Router } from 'express';
import { getResearch, createResearch, updateResearch, deleteResearch } from '../controllers/researchController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();
router.get('/', getResearch);
router.post('/', verifyToken, createResearch);
router.put('/:id', verifyToken, updateResearch);
router.delete('/:id', verifyToken, deleteResearch);

export default router;
