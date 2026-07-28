import Fee from '../models/Fee.js';
import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';

const SAMPLE_FEES = [
  {
    _id: 'f101',
    name: 'Tuition Fee - Semester V',
    amount: 60000,
    department: 'Computer Science',
    academicYear: '2025-2026',
    dueDate: '2026-08-30T00:00:00.000Z',
    description: 'Core academic tuition fee for semester V',
    active: true,
  },
  {
    _id: 'f102',
    name: 'Hostel & Mess Fee',
    amount: 35000,
    department: 'All Departments',
    academicYear: '2025-2026',
    dueDate: '2026-09-15T00:00:00.000Z',
    description: 'Accommodation and dining facilities fee',
    active: true,
  },
  {
    _id: 'f103',
    name: 'Library & Lab Fee',
    amount: 5000,
    department: 'All Departments',
    academicYear: '2025-2026',
    dueDate: '2026-08-15T00:00:00.000Z',
    description: 'Access to digital library and laboratory equipment',
    active: true,
  },
];

let inMemoryFees = [...SAMPLE_FEES];
const isDbConnected = () => mongoose.connection?.readyState === 1;

export const listFees = asyncHandler(async (_request, response) => {
  if (!isDbConnected()) {
    return response.json(inMemoryFees);
  }
  const fees = await Fee.find().sort({ dueDate: 1, createdAt: -1 });
  if (fees.length === 0) {
    return response.json(inMemoryFees);
  }
  response.json(fees);
});

export const createFee = asyncHandler(async (request, response) => {
  if (!isDbConnected()) {
    const newFee = { _id: `f${Date.now()}`, ...request.body, active: true };
    inMemoryFees.unshift(newFee);
    return response.status(201).json(newFee);
  }
  response.status(201).json(await Fee.create(request.body));
});

export const updateFee = asyncHandler(async (request, response) => {
  if (!isDbConnected()) {
    const index = inMemoryFees.findIndex((f) => f._id === request.params.id);
    if (index === -1) {
      const error = new Error('Fee record not found.');
      error.statusCode = 404;
      throw error;
    }
    inMemoryFees[index] = { ...inMemoryFees[index], ...request.body };
    return response.json(inMemoryFees[index]);
  }

  const fee = await Fee.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
  if (!fee) {
    const error = new Error('Fee record not found.');
    error.statusCode = 404;
    throw error;
  }
  response.json(fee);
});
