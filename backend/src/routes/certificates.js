import { Router } from 'express';
import { getCertificates, createCertificate, updateCertificate, deleteCertificate } from '../controllers/certificateController.js';
import { verifyToken } from '../middlewares/auth.js';
import { parser } from '../config/cloudinary.js';

const router = Router();
router.get('/', getCertificates);
router.post('/', verifyToken, parser.single('image'), createCertificate);
router.put('/:id', verifyToken, parser.single('image'), updateCertificate);
router.delete('/:id', verifyToken, deleteCertificate);

export default router;
