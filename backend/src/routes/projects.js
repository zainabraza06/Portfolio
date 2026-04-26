import { Router } from 'express';
import { getProjects, createProject, updateProject, deleteProject, syncGitHub } from '../controllers/projectController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();
router.get('/', getProjects);
router.post('/sync', verifyToken, syncGitHub);
router.post('/', verifyToken, createProject);
router.put('/:id', verifyToken, updateProject);
router.delete('/:id', verifyToken, deleteProject);

export default router;
