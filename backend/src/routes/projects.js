import { Router } from 'express';
import { getProjects, createProject, updateProject, deleteProject, syncGitHub, reorderProjects } from '../controllers/projectController.js';
import { verifyToken } from '../middlewares/auth.js';
import { parser } from '../config/cloudinary.js';

const router = Router();
router.get('/', getProjects);
router.post('/sync', verifyToken, syncGitHub);
router.patch('/reorder', verifyToken, reorderProjects);
router.post('/', verifyToken, parser.single('image'), createProject);
router.put('/:id', verifyToken, parser.single('image'), updateProject);
router.delete('/:id', verifyToken, deleteProject);

export default router;
