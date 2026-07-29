import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { calculateFeeSummary } from '../../../utils/feeSummary';
import styles from './Payment.module.css';
import {
  FiCreditCard,
  FiCheckCircle,
  FiArrowRight,
  FiShield,
  FiTag,
  FiAlertCircle,
  FiDollarSign,
} from 'react-icons/fi';

export default function Payment() {
  const location = useLocation();
  const { user, payments, fees, recordPayment, loading } = useAuth();
  const student = user?.studentData;
  const summary = calculateFeeSummary(
    student,
    fees,
    payments.filter(
      (payment) =>
        payment.student?._id === student?._id || payment.student === student?._id
    )
  );
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
    } else if (summary.outstandingBalance > 0) {
      setForm((current) => ({
        ...current,
        amount: String(summary.outstandingBalance),
      }));
    }
  }, [location.state, summary.outstandingBalance]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    const amount = Number(form.amount);

    if (amount <= 0 || amount > summary.outstandingBalance) {
      setMessage(
        `Enter a valid amount between ₹1 and ₹${summary.outstandingBalance.toLocaleString()}.`
      );
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
      setMessage(
        error.response?.data?.message ||
          error.message ||
          'Payment could not be recorded. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerBanner}>
        <div>
          <h1 className={styles.pageTitle}>Pay College Fees</h1>
          <p className={styles.pageSubtitle}>
            Secure online payment gateway for student tuition & academic fees.
          </p>
        </div>
        <div className={styles.badgeShield}>
          <FiShield style={{ color: '#D4A017' }} /> 256-Bit Encrypted
        </div>
      </div>

      {/* Summary Row Cards */}
      <div className={styles.summaryGrid}>
        <div className={`${styles.summaryCard} glass-panel`}>
          <div className={styles.summaryHeader}>
            <span className={styles.summaryLabel}>Total Prescribed Fee</span>
            <FiTag className={styles.cardIcon} />
          </div>
          <div className={styles.summaryValue}>
            ₹{summary.totalFees.toLocaleString()}
          </div>
        </div>

        <div className={`${styles.summaryCard} glass-panel`}>
          <div className={styles.summaryHeader}>
            <span className={styles.summaryLabel}>Total Amount Paid</span>
            <FiCheckCircle className={styles.cardIconSuccess} />
          </div>
          <div className={styles.summaryValueSuccess}>
            ₹{summary.paidAmount.toLocaleString()}
          </div>
        </div>

        <div className={`${styles.summaryCard} glass-panel`}>
          <div className={styles.summaryHeader}>
            <span className={styles.summaryLabel}>Outstanding Dues</span>
            <FiAlertCircle className={styles.cardIconWarning} />
          </div>
          <div className={styles.summaryValueWarning}>
            ₹{summary.outstandingBalance.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Main Payment Checkout Panel */}
      <div className={`${styles.checkoutCard} glass-panel`}>
        {isReviewing ? (
          <div className={styles.reviewStep}>
            <div className={styles.checkoutHeader}>
              <h2>
                <FiCreditCard style={{ color: '#D4A017' }} /> Payment Review
              </h2>
              <span className={styles.feeTypeBadge}>{form.feeType}</span>
            </div>

            <div className={styles.amountDisplayCard}>
              <span className={styles.amountLabel}>Total Payable Amount</span>
              <div className={styles.amountLarge}>
                ₹{Number(form.amount || 0).toLocaleString()}
              </div>
              <p className={styles.amountSubtext}>
                Department: {student?.department || 'Computer Science'} • Year:{' '}
                {student?.year || '2026'}
              </p>
            </div>

            <button
              className={styles.proceedPayBtn}
              type="button"
              onClick={() => setIsReviewing(false)}
            >
              Proceed to Pay <FiArrowRight />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.paymentForm}>
            <div className={styles.checkoutHeader}>
              <h2>
                <FiCreditCard style={{ color: '#D4A017' }} /> Confirm Payment Details
              </h2>
              <span className={styles.feeTypeBadge}>UPI / Online Checkout</span>
            </div>

            <div className={styles.inputGroup}>
              <label>
                <FiDollarSign /> Payment Amount (₹)
              </label>
              <input
                className={styles.inputField}
                type="number"
                min="1"
                max={summary.outstandingBalance}
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="Enter amount"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>
                <FiTag /> Fee Category / Purpose
              </label>
              <input
                className={styles.inputField}
                type="text"
                value={form.feeType}
                onChange={(e) => setForm({ ...form, feeType: e.target.value })}
                placeholder="e.g. Tuition Fee, Exam Fee"
                required
              />
            </div>

            {message && <div className={styles.errorAlert}>{message}</div>}

            <div className={styles.btnRow}>
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => setIsReviewing(true)}
              >
                Back
              </button>
              <button
                className={styles.proceedPayBtn}
                type="submit"
                disabled={loading || isSubmitting}
              >
                {isSubmitting ? (
                  'Processing Payment...'
                ) : (
                  <>
                    Confirm Payment <FiCheckCircle />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
