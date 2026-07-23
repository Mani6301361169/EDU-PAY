import Payment from '../models/Payment.js';
import Student from '../models/Student.js';
import asyncHandler from '../utils/asyncHandler.js';

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
    method: method || 'Cash',
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

export const handleStripeWebhook = asyncHandler(async (request, response) => {
  response.status(200).json({ received: true });
});
