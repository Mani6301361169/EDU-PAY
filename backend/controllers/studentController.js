import Student from '../models/Student.js';
import bcrypt from 'bcrypt';
import asyncHandler from '../utils/asyncHandler.js';

const SAMPLE_STUDENTS = [];
let inMemoryStudents = [...SAMPLE_STUDENTS];

const isDbConnected = () => mongoose.connection?.readyState === 1;

export const listStudents = asyncHandler(async (_request, response) => {
  if (!isDbConnected()) {
    return response.json(inMemoryStudents);
  }
  const students = await Student.find().sort({ createdAt: -1 });
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
      email: email,
      mobile: request.body.mobile || '',
      rollNo: rollNo || '',
      department: request.body.department || 'General',
      year: request.body.year || '1st Year',
      admissionYear: new Date().getFullYear().toString(),
      paidAmount: 0,
      pendingAmount: 50000,
      feeStatus: 'Pending',
    };
    inMemoryStudents.unshift(newStudent);
    return response.status(201).json(newStudent);
  }

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
