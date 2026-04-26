import { Router } from 'express';
import { submitContact, getMessages, markRead, deleteMessage } from '../controllers/contactController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();
router.post('/', submitContact);
router.get('/', verifyToken, getMessages);
router.patch('/:id/read', verifyToken, markRead);
router.delete('/:id', verifyToken, deleteMessage);

export default router;
