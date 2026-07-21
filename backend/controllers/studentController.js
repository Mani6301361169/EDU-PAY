import Student from '../models/Student.js';
import asyncHandler from '../utils/asyncHandler.js';

export const listStudents = asyncHandler(async (_request, response) => {
  const students = await Student.find().sort({ createdAt: -1 });
  response.json(students);
});

export const getStudent = asyncHandler(async (request, response) => {
  const student = await Student.findById(request.params.id);
  if (!student) {
    const error = new Error('Student not found.');
    error.statusCode = 404;
    throw error;
  }
  response.json(student);
});

export const createStudent = asyncHandler(async (request, response) => {
  const student = await Student.create({
    ...request.body,
    studentId: request.body.studentId || `S${Date.now().toString().slice(-8)}`,
  });
  response.status(201).json(student);
});

export const updateStudent = asyncHandler(async (request, response) => {
  const student = await Student.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
  if (!student) {
    const error = new Error('Student not found.');
    error.statusCode = 404;
    throw error;
  }
  response.json(student);
});

export const deleteStudent = asyncHandler(async (request, response) => {
  const student = await Student.findByIdAndDelete(request.params.id);
  if (!student) {
    const error = new Error('Student not found.');
    error.statusCode = 404;
    throw error;
  }
  response.status(204).send();
});
