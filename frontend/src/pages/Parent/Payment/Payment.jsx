import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { calculateFeeSummary } from '../../../utils/feeSummary';
import '../../Payments/Payments.module.css';

const qrPattern = Array.from({ length: 36 }, (_, index) => {
  const pattern = [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0];
  return pattern[index % pattern.length];
});

export default function Payment() {
  const location = useLocation();
  const { payments, fees, loading, recordPayment, user, students } = useAuth();
  const [form, setForm] = useState({ amount: '', feeType: 'Tuition Fee' });
  const [message, setMessage] = useState('');
  const [isReviewing, setIsReviewing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.amount !== undefined) {
      setForm((current) => ({
        ...current,
        amount: String(location.state.amount),
        feeType: location.state.feeType || current.feeType,
      }));
    }
  }, [location.state]);
  const student = students.find((item) => item.email === 'aarav.sharma@college.edu') || students[0];
  const summary = calculateFeeSummary(student, fees, payments.filter((payment) => payment.student?._id === student?._id || payment.student === student?._id));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    const amount = Number(form.amount);

    if (amount <= 0 || amount > summary.outstandingBalance) {
      setMessage(`Enter an amount between ₹1 and ₹${summary.outstandingBalance.toLocaleString()}.`);
      return;
    }

    setIsSubmitting(true);
    try {
      if (!student?._id) {
        throw new Error('No student found to assign this payment. Please refresh the page or contact support.');
      }

      const savedPayment = await recordPayment({
        student: student._id,
        amount,
        method: 'UPI',
        status: 'Success',
        feeType: form.feeType,
        paidAt: new Date().toISOString(),
      });

      navigate('success', {
        replace: true,
        state: {
          amount,
          feeType: form.feeType,
          method: 'UPI',
          paymentId: savedPayment._id,
        },
      });
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || error.message || 'Payment could not be recorded. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page">
      <h1>Payments</h1>
      <p>Make and track fee payments for your child.</p>

      <div className="panel">
        {isReviewing ? (
          <div className="form">
            <div className="item">
              <strong>Fee Summary</strong>
              <div className="amount">₹{Number(form.amount || 0).toLocaleString()}</div>
              <div style={{ marginTop: '0.35rem', color: '#e2c46b' }}>{form.feeType}</div>
            </div>
            <button className="button" type="button" onClick={() => setIsReviewing(false)}>Proceed to Pay</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form">
            <input className="input" type="number" min="1" max={summary.outstandingBalance} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Enter fee amount" required />
            <input className="input" type="text" value={form.feeType} onChange={(e) => setForm({ ...form, feeType: e.target.value })} placeholder="Fee type" required />
            <button className="button" type="submit" disabled={loading || isSubmitting}>{isSubmitting ? 'Processing...' : 'Confirm Payment'}</button>
          </form>
        )}
      </div>

      {message && <p className="message">{message}</p>}


      {loading ? (
        <p>Loading payments...</p>
      ) : payments.length === 0 ? (
        <p>No payment records found yet.</p>
      ) : (
        <div className="list" style={{ marginTop: '0.5rem' }}>
          {payments.map((payment) => (
            <div key={payment._id || payment.id} className="item">
              <strong>₹{Number(payment.amount || 0).toLocaleString()}</strong>
              <div className="amount">{payment.method || 'Online'} • {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'N/A'}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
