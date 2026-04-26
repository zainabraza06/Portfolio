import { Router } from 'express';
import {
  getTestimonials, getAllTestimonials, createTestimonial,
  updateTestimonial, approveTestimonial, deleteTestimonial
} from '../controllers/testimonialController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();
router.get('/', getTestimonials);
router.get('/all', verifyToken, getAllTestimonials);
router.post('/', verifyToken, createTestimonial);
router.put('/:id', verifyToken, updateTestimonial);
router.patch('/:id/approve', verifyToken, approveTestimonial);
router.delete('/:id', verifyToken, deleteTestimonial);

export default router;
