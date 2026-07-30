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
  FiDollarSign,
  FiFileText,
  FiTag,
} from 'react-icons/fi';

export default function Payment() {
  const location = useLocation();
  const { payments, fees, loading, recordPayment, students } = useAuth();
  const [form, setForm] = useState({ amount: '', feeType: 'Tuition Fee' });
  const [message, setMessage] = useState('');
  const [isReviewing, setIsReviewing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const parentEmail = user?.email?.toLowerCase();
  const parentName = user?.name?.toLowerCase();
  const parentFatherName = user?.fatherName?.toLowerCase();

  const student = students.find((item) => {
    if (!item) return false;
    if (user?.childRollNo && (item.rollNo === user.childRollNo || item.studentId === user.childRollNo)) return true;
    if (
      item.fatherName &&
      (item.fatherName.toLowerCase() === parentName ||
        item.fatherName.toLowerCase() === parentFatherName ||
        parentName?.includes(item.fatherName.toLowerCase()))
    ) {
      return true;
    }
    if (item.email && parentEmail && item.email.split('@')[0] === parentEmail.split('@')[0]) return true;
    return false;
  }) || students[0];
  const studentPayments = payments.filter(
    (payment) =>
      payment.student?._id === student?._id || payment.student === student?._id
  );
  const summary = calculateFeeSummary(student, fees, studentPayments);

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

    if (amount <= 0 || isNaN(amount)) {
      setMessage('Please enter a valid payment amount greater than ₹0.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!student?._id) {
        throw new Error(
          'No student found to assign this payment. Please refresh the page or contact support.'
        );
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
          <h1 className={styles.pageTitle}>Parent Fee Portal</h1>
          <p className={styles.pageSubtitle}>
            Student: {student?.name || 'Aarav Sharma'} • Roll No:{' '}
            {student?.rollNo || 'CS202601'}
          </p>
        </div>
        <div className={styles.badgeShield}>
          <FiShield style={{ color: '#D4A017' }} /> Verified Parent Access
        </div>
      </div>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        <div className={`${styles.summaryCard} glass-panel`}>
          <span className={styles.summaryLabel}>Total Prescribed Fees</span>
          <div className={styles.summaryValue}>
            ₹{summary.totalFees.toLocaleString()}
          </div>
        </div>

        <div className={`${styles.summaryCard} glass-panel`}>
          <span className={styles.summaryLabel}>Total Amount Paid</span>
          <div className={styles.summaryValueSuccess}>
            ₹{summary.paidAmount.toLocaleString()}
          </div>
        </div>

        <div className={`${styles.summaryCard} glass-panel`}>
          <span className={styles.summaryLabel}>Outstanding Dues</span>
          <div className={styles.summaryValueWarning}>
            ₹{summary.outstandingBalance.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Main Payment Checkout Card */}
      <div className={`${styles.checkoutCard} glass-panel`}>
        {isReviewing ? (
          <div className={styles.reviewStep}>
            <div className={styles.checkoutHeader}>
              <h2>
                <FiCreditCard style={{ color: '#D4A017' }} /> Fee Checkout Review
              </h2>
              <span className={styles.feeTypeBadge}>{form.feeType}</span>
            </div>

            <div className={styles.amountDisplayCard}>
              <span className={styles.amountLabel}>Total Payable Amount</span>
              <div className={styles.amountLarge}>
                ₹{Number(form.amount || 0).toLocaleString()}
              </div>
              <p className={styles.amountSubtext}>
                Student: {student?.name} • Dept: {student?.department} ({student?.year})
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
                <FiCreditCard style={{ color: '#D4A017' }} /> Confirm Payment
              </h2>
              <span className={styles.feeTypeBadge}>Instant UPI Payment</span>
            </div>

            <div className={styles.inputGroup}>
              <label>
                <FiDollarSign /> Payment Amount (₹)
              </label>
              <input
                className={styles.inputField}
                type="number"
                min="1"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="Enter fee amount (e.g. 5000)"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>
                <FiTag /> Fee Category / Purpose
              </label>
              <select
                className={styles.selectField}
                value={form.feeType}
                onChange={(e) => setForm({ ...form, feeType: e.target.value })}
                required
              >
                <option value="College Fees">College Fees</option>
                <option value="Tuition Fees">Tuition Fees</option>
                <option value="Hostel Fees">Hostel Fees</option>
                <option value="Exam Fees">Exam Fees</option>
                <option value="Bus Fees">Bus Fees</option>
              </select>
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
                  'Processing...'
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

      {/* Payment History Card List (Replacing Plain Tables) */}
      <div className={styles.sectionHeader}>
        <h2>
          <FiFileText style={{ color: '#D4A017' }} /> Recent Payment History
        </h2>
      </div>

      {loading ? (
        <div className={`${styles.historyCard} glass-panel`}>Loading payment history...</div>
      ) : studentPayments.length === 0 ? (
        <div className={`${styles.historyCard} glass-panel`}>
          No payment transaction records found yet.
        </div>
      ) : (
        <div className={styles.historyList}>
          {studentPayments.map((payment) => (
            <div
              key={payment._id || payment.id}
              className={`${styles.historyItemCard} glass-panel`}
            >
              <div className={styles.historyCardHeader}>
                <div className={styles.historyCardTitleGroup}>
                  <span className={styles.historyAmount}>
                    ₹{Number(payment.amount || 0).toLocaleString()}
                  </span>
                  <span className={styles.historyFeeType}>
                    {payment.feeType || 'Tuition Fee'}
                  </span>
                </div>
                <span className={styles.statusSuccess}>
                  <FiCheckCircle /> Success
                </span>
              </div>

              <div className={styles.historyCardBody}>
                <div className={styles.historyDetail}>
                  <span>Payment Method</span>
                  <strong>{payment.method || 'UPI / Online'}</strong>
                </div>
                <div className={styles.historyDetail}>
                  <span>Transaction Date</span>
                  <strong>
                    {payment.paidAt
                      ? new Date(payment.paidAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
