import { Router } from 'express';
import { login, changePassword } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();
router.post('/login', login);
router.post('/change-password', verifyToken, changePassword);

export default router;
