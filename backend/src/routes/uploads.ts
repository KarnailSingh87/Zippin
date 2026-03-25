import { Router } from 'express';
import { getUploadSignature } from '../controllers/uploads';

const router = Router();
router.get('/sign', getUploadSignature);

export default router;
