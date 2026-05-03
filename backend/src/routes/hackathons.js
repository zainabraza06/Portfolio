import { Router } from 'express';
import { getHackathons, createHackathon, updateHackathon, deleteHackathon } from '../controllers/hackathonController.js';
import { verifyToken } from '../middlewares/auth.js';
import { parser } from '../config/cloudinary.js';

const router = Router();
router.get('/', getHackathons);
router.post('/', verifyToken, parser.single('image'), createHackathon);
router.put('/:id', verifyToken, parser.single('image'), updateHackathon);
router.delete('/:id', verifyToken, deleteHackathon);

export default router;
