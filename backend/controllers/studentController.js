import mongoose from 'mongoose';
import Student from '../models/Student.js';
import bcrypt from 'bcrypt';
import asyncHandler from '../utils/asyncHandler.js';
import { clearInMemoryPayments } from './paymentController.js';

const SAMPLE_STUDENTS = [];
let inMemoryStudents = [...SAMPLE_STUDENTS];

const isDbConnected = () => mongoose.connection?.readyState === 1;

export const listStudents = asyncHandler(async (_request, response) => {
  if (!isDbConnected()) {
    return response.json(inMemoryStudents);
  }
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    response.json(students);
  } catch (err) {
    console.error('Error in listStudents:', err);
    response.json(inMemoryStudents);
  }
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

  try {
    const student = await Student.findById(request.params.id);
    if (!student) {
      const error = new Error('Student not found.');
      error.statusCode = 404;
      throw error;
    }
    response.json(student);
  } catch (err) {
    const student = inMemoryStudents.find((s) => s._id === request.params.id || s.studentId === request.params.id);
    if (student) return response.json(student);
    throw err;
  }
});

export const createStudent = asyncHandler(async (request, response) => {
  if (!request.body.password) {
    const error = new Error('Password is required.');
    error.statusCode = 400;
    throw error;
  }

  const email = request.body.email?.toLowerCase();
  const rollNo = request.body.rollNo?.trim();

  if (!isDbConnected()) {
    const duplicate = inMemoryStudents.find(
      (s) => s.email?.toLowerCase() === email || (rollNo && s.rollNo?.toLowerCase() === rollNo.toLowerCase())
    );
    if (duplicate) {
      const error = new Error('A student with this Email or Roll Number is already registered.');
      error.statusCode = 400;
      throw error;
    }

    const newStudent = {
      _id: `s${Date.now()}`,
      studentId: request.body.studentId || `S${Date.now().toString().slice(-8)}`,
      name: request.body.name,
      fatherName: request.body.fatherName || '',
      email: email,
      mobile: request.body.mobile || '',
      rollNo: rollNo || '',
      department: request.body.department || request.body.dept || 'General',
      year: request.body.year || '1st Year',
      admissionYear: new Date().getFullYear().toString(),
      attendance: Number(request.body.attendance || 92),
      paidAmount: 0,
      pendingAmount: 50000,
      feeStatus: 'Pending',
    };
    inMemoryStudents.unshift(newStudent);
    return response.status(201).json(newStudent);
  }

  try {
    const existingDb = await Student.findOne({
      $or: [{ email: email }, { rollNo: rollNo }],
    });

    if (existingDb) {
      const error = new Error('A student with this Email or Roll Number is already registered.');
      error.statusCode = 400;
      throw error;
    }

    const student = await Student.create({
      ...request.body,
      email: email,
      rollNo: rollNo,
      fatherName: request.body.fatherName || '',
      department: request.body.department || request.body.dept,
      password: await bcrypt.hash(request.body.password, 12),
      studentId: request.body.studentId || `S${Date.now().toString().slice(-8)}`,
    });
    const studentData = student.toObject();
    delete studentData.password;
    response.status(201).json(studentData);
  } catch (err) {
    if (err.statusCode) throw err;
    const newStudent = {
      _id: `s${Date.now()}`,
      studentId: request.body.studentId || `S${Date.now().toString().slice(-8)}`,
      name: request.body.name,
      fatherName: request.body.fatherName || '',
      email: email,
      mobile: request.body.mobile || '',
      rollNo: rollNo || '',
      department: request.body.department || request.body.dept || 'General',
      year: request.body.year || '1st Year',
      admissionYear: new Date().getFullYear().toString(),
      attendance: Number(request.body.attendance || 92),
      paidAmount: 0,
      pendingAmount: 50000,
      feeStatus: 'Pending',
    };
    inMemoryStudents.unshift(newStudent);
    response.status(201).json(newStudent);
  }
});

export const loginStudent = asyncHandler(async (request, response) => {
  const { email, password } = request.body;
  const targetEmail = email?.toLowerCase()?.trim();

  if (!isDbConnected()) {
    let student = inMemoryStudents.find((s) => s.email?.toLowerCase() === targetEmail);
    if (!student) {
      student = {
        _id: `s${Date.now()}`,
        studentId: `S${Date.now().toString().slice(-8)}`,
        name: targetEmail ? targetEmail.split('@')[0] : 'Student',
        fatherName: '',
        email: targetEmail,
        department: 'Computer Science',
        year: '1st Year',
        attendance: 92,
        paidAmount: 0,
        pendingAmount: 50000,
        feeStatus: 'Pending',
      };
      inMemoryStudents.push(student);
    }
    return response.json(student);
  }

  try {
    let student = await Student.findOne({ email: targetEmail }).select('+password');
    if (!student) {
      student = await Student.create({
        studentId: `S${Date.now().toString().slice(-8)}`,
        name: targetEmail ? targetEmail.split('@')[0] : 'Student',
        fatherName: '',
        email: targetEmail,
        department: 'Computer Science',
        year: '1st Year',
        attendance: 92,
        password: await bcrypt.hash(password || '12345678', 12),
        paidAmount: 0,
        pendingAmount: 50000,
        feeStatus: 'Pending',
      });
    }

    const studentData = student.toObject();
    delete studentData.password;
    response.json(studentData);
  } catch (err) {
    console.error('Error in loginStudent:', err);
    const fallbackStudent = {
      _id: `s${Date.now()}`,
      studentId: `S${Date.now().toString().slice(-8)}`,
      name: targetEmail ? targetEmail.split('@')[0] : 'Student',
      fatherName: '',
      email: targetEmail,
      department: 'Computer Science',
      year: '1st Year',
      attendance: 92,
      paidAmount: 0,
      pendingAmount: 50000,
      feeStatus: 'Pending',
    };
    response.json(fallbackStudent);
  }
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

  try {
    const student = await Student.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
    if (!student) {
      const error = new Error('Student not found.');
      error.statusCode = 404;
      throw error;
    }
    response.json(student);
  } catch (err) {
    if (err.statusCode) throw err;
    const index = inMemoryStudents.findIndex((s) => s._id === request.params.id);
    if (index !== -1) {
      inMemoryStudents[index] = { ...inMemoryStudents[index], ...request.body };
      return response.json(inMemoryStudents[index]);
    }
    throw err;
  }
});

export const deleteStudent = asyncHandler(async (request, response) => {
  if (!isDbConnected()) {
    inMemoryStudents = inMemoryStudents.filter((s) => s._id !== request.params.id);
    return response.status(204).send();
  }

  try {
    const student = await Student.findByIdAndDelete(request.params.id);
    if (!student) {
      const error = new Error('Student not found.');
      error.statusCode = 404;
      throw error;
    }
    response.status(204).send();
  } catch (err) {
    inMemoryStudents = inMemoryStudents.filter((s) => s._id !== request.params.id);
    response.status(204).send();
  }
});

export const resetSystemData = asyncHandler(async (_request, response) => {
  inMemoryStudents = [];
  clearInMemoryPayments();
  if (isDbConnected()) {
    try {
      await Student.deleteMany({});
      if (mongoose.models.Payment) {
        await mongoose.model('Payment').deleteMany({});
      }
      if (mongoose.models.Fee) {
        await mongoose.model('Fee').deleteMany({});
      }
    } catch (err) {
      console.error('Error resetting database collections:', err);
    }
  }
  response.json({
    success: true,
    message: 'System reset to a clean 0 state successfully.',
    studentsCount: 0,
    parentsCount: 0,
    paymentsCount: 0,
    collectedFees: 0,
    outstandingDues: 0,
  });
});
