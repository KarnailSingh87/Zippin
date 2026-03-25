import { Router } from 'express';
import { listCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/categories';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();
router.get('/', listCategories);
router.get('/:slug', getCategory);
router.post('/', authenticate, requireAdmin, createCategory);
router.put('/:id', authenticate, requireAdmin, updateCategory);
router.delete('/:id', authenticate, requireAdmin, deleteCategory);

export default router;
