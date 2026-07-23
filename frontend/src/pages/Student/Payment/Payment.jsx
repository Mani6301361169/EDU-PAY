
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { calculateFeeSummary } from '../../../utils/feeSummary';
import PaymentSuccess from '../../../components/PaymentSuccess/PaymentSuccess';
import '../../Payments/Payments.module.css';

const qrPattern = Array.from({ length: 36 }, (_, index) => {
  // Define a simple pattern for the QR code cells (1 for filled, 0 for empty)
  const pattern = [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0];
  return pattern[index % pattern.length];
});

export default function Payment() {
  const location = useLocation();
  const { user, payments, fees, recordPayment, loading } = useAuth();
  const student = user?.studentData;
  const summary = calculateFeeSummary(student, fees, payments.filter((payment) => payment.student?._id === student?._id || payment.student === student?._id));
  const [form, setForm] = useState({ amount: '', method: 'UPI', feeType: 'Tuition Fee' });
  const [message, setMessage] = useState('');
  const [isReviewing, setIsReviewing] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        method: form.method,
        status: 'Success',
        feeType: form.feeType,
        paidAt: new Date().toISOString(),
      });

      setPaymentDetails({
        amount,
        feeType: form.feeType,
        method: form.method,
        holder: 'College Fees Portal',
        accountNumber: '1234567890',
        ifsc: 'SBIN0001234',
        upi: 'collegefees@upi',
        paymentId: savedPayment._id,
      });
      setMessage('Payment recorded successfully. Please use the details below to complete the transfer.');
      setForm({ amount: '', method: 'UPI', feeType: 'Tuition Fee' });
      setIsReviewing(true);
    } catch (error) {
      console.error(error);
      setPaymentDetails(null);
      setMessage(error.response?.data?.message || error.message || 'Payment could not be recorded. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page">
      <h1>Pay Your Fees</h1>
      <p>Record a fee payment for your student account.</p>

      <div className="summaryGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem', margin: '1rem 0' }}>
        <div style={{ padding: '0.75rem', borderRadius: '8px', background: '#fff' }}>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Fees</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹{summary.totalFees.toLocaleString()}</div>
        </div>
        <div style={{ padding: '0.75rem', borderRadius: '8px', background: '#fff' }}>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>Paid So Far</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹{summary.paidAmount.toLocaleString()}</div>
        </div>
        <div style={{ padding: '0.75rem', borderRadius: '8px', background: '#fff' }}>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>Remaining</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹{summary.outstandingBalance.toLocaleString()}</div>
        </div>
      </div>

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
            <input className="input" type="number" min="1" max={summary.outstandingBalance} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Amount" required />
            <select className="select" value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
              <option value="UPI">UPI</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash">Cash</option>
            </select>
            <input className="input" type="text" value={form.feeType} onChange={(e) => setForm({ ...form, feeType: e.target.value })} placeholder="Fee type" required />
            <button className="button" type="submit" disabled={loading || isSubmitting}>{isSubmitting ? 'Processing...' : 'Confirm Payment'}</button>
          </form>
        )}
      </div>

      {message && <p className="message">{message}</p>}

      {paymentDetails && <PaymentSuccess amount={paymentDetails.amount} feeType={paymentDetails.feeType} method={paymentDetails.method} />}

      {paymentDetails && (
        <div className="paymentCard">
          <div className="qrGrid" aria-label="QR code placeholder">
            {qrPattern.map((cell, index) => (
              <span key={index} className={cell ? 'qrCell qrCellFilled' : 'qrCell'} />
            ))}
          </div>

          <div className="paymentDetailsList">
            <div className="detailRow"><span>Amount</span><strong>₹{paymentDetails.amount.toLocaleString()}</strong></div>
            <div className="detailRow"><span>Fee Type</span><strong>{paymentDetails.feeType}</strong></div>
            <div className="detailRow"><span>Method</span><strong>{paymentDetails.method}</strong></div>
            <div className="detailRow"><span>Account Holder</span><strong>{paymentDetails.holder}</strong></div>
            <div className="detailRow"><span>Account No.</span><strong>{paymentDetails.accountNumber}</strong></div>
            <div className="detailRow"><span>IFSC</span><strong>{paymentDetails.ifsc}</strong></div>
            <div className="detailRow"><span>UPI</span><strong>{paymentDetails.upi}</strong></div>
          </div>
        </div>
      )}
    </section>
  );
}
