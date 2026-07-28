import Student from '../models/Student.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';

const SAMPLE_STUDENTS = [
  {
    _id: 's100',
    studentId: 'STU2026000',
    name: 'Demo Student',
    email: 'test@gmail.com',
    mobile: '+91 9876543210',
    rollNo: 'CS2026-001',
    department: 'Computer Science',
    year: '3rd Year',
    admissionYear: '2023',
    paidAmount: 85000,
    pendingAmount: 15000,
    feeStatus: 'Pending',
  },
  {
    _id: 's101',
    studentId: 'STU2026001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    mobile: '+91 9876543210',
    rollNo: 'CS2026-042',
    department: 'Computer Science',
    year: '3rd Year',
    admissionYear: '2023',
    paidAmount: 85000,
    pendingAmount: 15000,
    feeStatus: 'Pending',
  },
  {
    _id: 's102',
    studentId: 'STU2026002',
    name: 'Priya Patel',
    email: 'priya.patel@college.edu',
    mobile: '+91 9876543211',
    rollNo: 'ECE2026-018',
    department: 'Electronics & Communication',
    year: '2nd Year',
    admissionYear: '2024',
    paidAmount: 95000,
    pendingAmount: 0,
    feeStatus: 'Paid',
  },
];

let inMemoryStudents = [...SAMPLE_STUDENTS];

const isDbConnected = () => mongoose.connection?.readyState === 1;

export const listStudents = asyncHandler(async (_request, response) => {
  if (!isDbConnected()) {
    return response.json(inMemoryStudents);
  }
  const students = await Student.find().sort({ createdAt: -1 });
  if (students.length === 0) {
    return response.json(inMemoryStudents);
  }
  response.json(students);
});

export const getStudent = asyncHandler(async (request, response) => {
  if (!isDbConnected()) {
    const student = inMemoryStudents.find((s) => s._id === request.params.id || s.studentId === request.params.id);
    if (!student) {
      const error = new Error('Student not found.');
      error.statusCode = 404;
      throw error;
    }
    return response.json(student);
  }

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

  if (!isDbConnected()) {
    const newStudent = {
      _id: `s${Date.now()}`,
      studentId: request.body.studentId || `S${Date.now().toString().slice(-8)}`,
      name: request.body.name,
      email: request.body.email?.toLowerCase(),
      mobile: request.body.mobile || '',
      rollNo: request.body.rollNo || '',
      department: request.body.department || 'General',
      year: request.body.year || '1st Year',
      admissionYear: new Date().getFullYear().toString(),
      paidAmount: 0,
      pendingAmount: 100000,
      feeStatus: 'Pending',
    };
    inMemoryStudents.unshift(newStudent);
    return response.status(201).json(newStudent);
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
  const targetEmail = email?.toLowerCase();

  // Test account fallback
  if (targetEmail === 'test@gmail.com') {
    const testStudent = inMemoryStudents.find((s) => s.email === 'test@gmail.com') || SAMPLE_STUDENTS[0];
    return response.json(testStudent);
  }

  if (!isDbConnected()) {
    const student = inMemoryStudents.find((s) => s.email?.toLowerCase() === targetEmail);
    if (!student) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }
    return response.json(student);
  }

  const student = await Student.findOne({ email: targetEmail }).select('+password');
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
  if (!isDbConnected()) {
    const index = inMemoryStudents.findIndex((s) => s._id === request.params.id);
    if (index === -1) {
      const error = new Error('Student not found.');
      error.statusCode = 404;
      throw error;
    }
    inMemoryStudents[index] = { ...inMemoryStudents[index], ...request.body };
    return response.json(inMemoryStudents[index]);
  }

  const student = await Student.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
  if (!student) {
    const error = new Error('Student not found.');
    error.statusCode = 404;
    throw error;
  }
  response.json(student);
});

export const deleteStudent = asyncHandler(async (request, response) => {
  if (!isDbConnected()) {
    inMemoryStudents = inMemoryStudents.filter((s) => s._id !== request.params.id);
    return response.status(204).send();
  }

  const student = await Student.findByIdAndDelete(request.params.id);
  if (!student) {
    const error = new Error('Student not found.');
    error.statusCode = 404;
    throw error;
  }
  response.status(204).send();
});
