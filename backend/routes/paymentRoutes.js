import { Router } from 'express';
import { createCheckoutSession, createPayment, handleStripeWebhook, listPayments } from '../controllers/paymentController.js';

const router = Router();
router.post('/webhook', handleStripeWebhook);
router.route('/').get(listPayments).post(createPayment);
router.post('/checkout', createCheckoutSession);

export default router;
