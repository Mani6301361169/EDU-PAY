import { Router } from 'express';
import { createFee, listFees, updateFee } from '../controllers/feeController.js';

const router = Router();
router.route('/').get(listFees).post(createFee);
router.route('/:id').patch(updateFee);

export default router;
