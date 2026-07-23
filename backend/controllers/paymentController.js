import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import Student from '../models/Student.js';
import asyncHandler from '../utils/asyncHandler.js';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export const listPayments = asyncHandler(async (_request, response) => {
  const payments = await Payment.find().populate('student', 'studentId name email').sort({ paidAt: -1 });
  response.json(payments);
});

export const createPayment = asyncHandler(async (request, response) => {
  const { student: studentId, amount, feeType, method, status } = request.body;

  if (!studentId || !amount || !feeType) {
    const error = new Error('student, amount, and feeType are required.');
    error.statusCode = 400;
    throw error;
  }

  const student = await Student.findById(studentId);
  if (!student) {
    const error = new Error('Student not found.');
    error.statusCode = 404;
    throw error;
  }

  const payment = await Payment.create({
    student: studentId,
    amount,
    feeType,
    method: method || 'Stripe',
    status: status || 'Pending',
    paidAt: status === 'Success' ? new Date() : undefined,
  });

  if (payment.status === 'Success') {
    student.paidAmount += Number(payment.amount || 0);
    student.pendingAmount = Math.max(0, student.pendingAmount - Number(payment.amount || 0));
    student.feeStatus = student.pendingAmount === 0 ? 'Paid' : 'Pending';
    await student.save();
  }

  response.status(201).json(await payment.populate('student', 'studentId name email'));
});

export const createCheckoutSession = asyncHandler(async (request, response) => {
  const { student, amount, feeType } = request.body;

  if (!student || !amount || !feeType) {
    const error = new Error('student, amount, and feeType are required.');
    error.statusCode = 400;
    throw error;
  }

  const studentRecord = await Student.findById(student);
  if (!studentRecord) {
    const error = new Error('Student not found.');
    error.statusCode = 404;
    throw error;
  }

  if (!stripe) {
    const error = new Error('Stripe is not configured. Add STRIPE_SECRET_KEY to the backend environment.');
    error.statusCode = 500;
    throw error;
  }

  const payment = await Payment.create({
    student,
    amount,
    feeType,
    method: 'Stripe',
    status: 'Pending',
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'inr',
        product_data: { name: `${feeType} Fee` },
        unit_amount: Math.round(amount * 100),
      },
      quantity: 1,
    }],
    success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment-cancelled`,
    metadata: { paymentId: payment._id.toString(), studentId: student, feeType },
  });

  payment.stripeSessionId = session.id;
  payment.transactionId = session.id;
  await payment.save();

  response.json({ url: session.url, payment });
});

export const handleStripeWebhook = asyncHandler(async (request, response) => {
  const sig = request.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !endpointSecret) {
    response.status(200).json({ received: true });
    return;
  }

  const event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const payment = await Payment.findOne({ stripeSessionId: session.id });

    if (payment && payment.status !== 'Success') {
      payment.status = 'Success';
      payment.stripePaymentIntentId = session.payment_intent || '';
      payment.transactionId = session.payment_intent || session.id;
      payment.paidAt = new Date();
      await payment.save();

      const student = await Student.findById(payment.student);
      if (student) {
        student.paidAmount += payment.amount;
        student.pendingAmount = Math.max(0, student.pendingAmount - payment.amount);
        student.feeStatus = student.pendingAmount === 0 ? 'Paid' : 'Pending';
        await student.save();
      }
    }
  }

  response.status(200).json({ received: true });
});
