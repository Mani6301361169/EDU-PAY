import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    academicYear: { type: String, required: true, trim: true },
    dueDate: { type: Date },
    description: { type: String, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model('Fee', feeSchema);
