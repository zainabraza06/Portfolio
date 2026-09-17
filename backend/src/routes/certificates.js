import { Router } from 'express';
import { getCertificates, createCertificate, updateCertificate, deleteCertificate, reorderCertificates } from '../controllers/certificateController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();
router.get('/', getCertificates);
router.post('/', verifyToken, createCertificate);
router.patch('/reorder', verifyToken, reorderCertificates);
router.put('/:id', verifyToken, updateCertificate);
router.delete('/:id', verifyToken, deleteCertificate);

export default router;
