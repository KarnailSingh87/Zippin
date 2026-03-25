import { Router } from 'express';
import auth from './auth';
import uploads from './uploads';
import products from './products';
import categories from './categories';
import orders from './orders';
import internal from './internal';

const router = Router();
router.use('/auth', auth);
router.use('/uploads', uploads);
router.use('/products', products);
router.use('/categories', categories);
router.use('/orders', orders);
router.use('/internal', internal);

export default router;
