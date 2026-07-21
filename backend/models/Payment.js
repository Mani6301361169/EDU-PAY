import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    transactionId: { type: String, trim: true, sparse: true, unique: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    amount: { type: Number, required: true, min: 1 },
    method: { type: String, enum: ['UPI', 'Net Banking', 'Credit Card', 'Debit Card', 'Cash', 'Stripe'], default: 'Stripe' },
    status: { type: String, enum: ['Success', 'Pending', 'Failed'], default: 'Pending' },
    feeType: { type: String, required: true, trim: true },
    stripeSessionId: { type: String, trim: true, sparse: true },
    stripePaymentIntentId: { type: String, trim: true, sparse: true },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model('Payment', paymentSchema);
