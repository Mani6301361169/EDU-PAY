import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    fatherName: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    mobile: { type: String, trim: true },
    rollNo: { type: String, unique: true, sparse: true, trim: true },
    department: { type: String, trim: true },
    year: { type: String, trim: true },
    admissionYear: { type: String, trim: true },
    scholarship: { type: Number, default: 0, min: 0 },
    attendance: { type: Number, default: 92, min: 0, max: 100 },
    paidAmount: { type: Number, default: 0, min: 0 },
    pendingAmount: { type: Number, default: 0, min: 0 },
    feeStatus: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model('Student', studentSchema);
