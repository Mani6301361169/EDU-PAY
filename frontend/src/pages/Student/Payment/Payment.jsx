
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { calculateFeeSummary } from '../../../utils/feeSummary';
import styles from './Payment.module.css';



export default function Payment() {
  const location = useLocation();
  const { user, payments, fees, recordPayment, loading } = useAuth();
  const student = user?.studentData;
  const summary = calculateFeeSummary(student, fees, payments.filter((payment) => payment.student?._id === student?._id || payment.student === student?._id));
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
      const savedPayment = await recordPayment({
        student: student?._id || user?.uid,
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
      <h1>Pay Your Fees</h1>
      <p>Record a fee payment for your student account.</p>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Total Fees</div>
          <div className={styles.summaryValue}>₹{summary.totalFees.toLocaleString()}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Paid So Far</div>
          <div className={styles.summaryValue}>₹{summary.paidAmount.toLocaleString()}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Remaining</div>
          <div className={styles.summaryValue}>₹{summary.outstandingBalance.toLocaleString()}</div>
        </div>
      </div>

      <div className="panel">
        {isReviewing ? (
          <div className="form">
            <div className="item">
              <strong>Fee Summary</strong>
              <div className="amount">₹{Number(form.amount || 0).toLocaleString()}</div>
              <div className={styles.feeTypeLabel}>{form.feeType}</div>
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

    </section>
  );
}
