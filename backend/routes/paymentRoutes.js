import { Router } from 'express';
import { createPayment, handleStripeWebhook, listPayments } from '../controllers/paymentController.js';

const router = Router();
router.post('/webhook', handleStripeWebhook);
router.post('/checkout', createPayment);
router.route('/').get(listPayments).post(createPayment);

export default router;
