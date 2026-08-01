import mongoose from 'mongoose';
import Payment from '../models/Payment.js';
import Student from '../models/Student.js';
import asyncHandler from '../utils/asyncHandler.js';

let inMemoryPayments = [];

const isDbConnected = () => mongoose.connection?.readyState === 1;

export const listPayments = asyncHandler(async (_request, response) => {
  if (!isDbConnected()) {
    return response.json(inMemoryPayments);
  }
  try {
    const payments = await Payment.find()
      .populate('student', 'studentId name email')
      .sort({ paidAt: -1 });
    response.json(payments);
  } catch (err) {
    console.error('Error in listPayments:', err);
    response.json(inMemoryPayments);
  }
});

export const createPayment = asyncHandler(async (request, response) => {
  const { student: rawStudent, studentId: altStudentId, amount, feeType, method, status } = request.body;
  const resolvedStudentId = typeof rawStudent === 'object' ? rawStudent?._id : (rawStudent || altStudentId);
  const normalizedAmount = Math.abs(Number(amount || 0));
  const normalizedStatus = status === 'Success' ? 'Success' : 'Pending';
  const effectiveFeeType = feeType || 'College Fees';

  if (!resolvedStudentId || !normalizedAmount) {
    const error = new Error('student, amount, and feeType are required.');
    error.statusCode = 400;
    throw error;
  }

  if (!isDbConnected()) {
    const localPayment = {
      _id: `txn-${Date.now()}`,
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      student: { _id: resolvedStudentId, name: request.body.name || 'Student', email: request.body.email },
      amount: normalizedAmount,
      feeType: effectiveFeeType,
      method: method || 'UPI',
      status: normalizedStatus,
      paidAt: new Date().toISOString(),
    };
    inMemoryPayments.unshift(localPayment);
    return response.status(201).json(localPayment);
  }

  try {
    let student = await Student.findById(resolvedStudentId);
    if (!student) {
      student = await Student.findOne({ email: request.body.email || 'student@college.edu' });
    }

    if (!student) {
      student = await Student.create({
        _id: resolvedStudentId && resolvedStudentId.match(/^[0-9a-fA-F]{24}$/) ? resolvedStudentId : undefined,
        studentId: `STU-${Date.now()}`,
        name: request.body.name || 'Registered Student',
        email: request.body.email || `student_${Date.now()}@college.edu`,
        department: 'Computer Science',
        year: '2026',
        totalFees: 50000,
        paidAmount: 0,
        pendingAmount: 50000,
        feeStatus: 'Pending',
      });
    }

    const payment = await Payment.create({
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      student: student._id,
      amount: normalizedAmount,
      feeType: effectiveFeeType,
      method: method || 'UPI',
      status: normalizedStatus,
      paidAt: normalizedStatus === 'Success' ? new Date() : undefined,
    });

    if (payment.status === 'Success') {
      const currentPaidAmount = Number(student.paidAmount || 0);
      const currentPendingAmount = Number(student.pendingAmount || 0);
      student.paidAmount = currentPaidAmount + normalizedAmount;
      student.pendingAmount = Math.max(0, currentPendingAmount - normalizedAmount);
      student.feeStatus = student.pendingAmount === 0 ? 'Paid' : 'Pending';
      await student.save();
    }

    const populatedPayment = await payment.populate('student', 'studentId name email');
    response.status(201).json(populatedPayment);
  } catch (err) {
    console.error('Error in createPayment:', err);
    const localPayment = {
      _id: `txn-${Date.now()}`,
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      student: { _id: resolvedStudentId, name: request.body.name || 'Student', email: request.body.email },
      amount: normalizedAmount,
      feeType: effectiveFeeType,
      method: method || 'UPI',
      status: normalizedStatus,
      paidAt: new Date().toISOString(),
    };
    inMemoryPayments.unshift(localPayment);
    response.status(201).json(localPayment);
  }
});

export const clearInMemoryPayments = () => {
  inMemoryPayments = [];
};

export const handleStripeWebhook = asyncHandler(async (request, response) => {
  response.status(200).json({ received: true });
});
