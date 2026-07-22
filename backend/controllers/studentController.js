import Student from '../models/Student.js';
import bcrypt from 'bcrypt';
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
  if (!request.body.password) {
    const error = new Error('Password is required.');
    error.statusCode = 400;
    throw error;
  }

  const student = await Student.create({
    ...request.body,
    password: await bcrypt.hash(request.body.password, 12),
    studentId: request.body.studentId || `S${Date.now().toString().slice(-8)}`,
  });
  const studentData = student.toObject();
  delete studentData.password;
  response.status(201).json(studentData);
});

export const loginStudent = asyncHandler(async (request, response) => {
  const { email, password } = request.body;
  const student = await Student.findOne({ email: email?.toLowerCase() }).select('+password');

  if (!student || !password || !(await bcrypt.compare(password, student.password))) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const studentData = student.toObject();
  delete studentData.password;
  response.json(studentData);
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
