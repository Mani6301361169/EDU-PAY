import Fee from '../models/Fee.js';
import asyncHandler from '../utils/asyncHandler.js';

export const listFees = asyncHandler(async (_request, response) => {
  response.json(await Fee.find().sort({ dueDate: 1, createdAt: -1 }));
});

export const createFee = asyncHandler(async (request, response) => {
  response.status(201).json(await Fee.create(request.body));
});

export const updateFee = asyncHandler(async (request, response) => {
  const fee = await Fee.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
  if (!fee) {
    const error = new Error('Fee record not found.');
    error.statusCode = 404;
    throw error;
  }
  response.json(fee);
});
