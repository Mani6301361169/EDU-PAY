import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { calculateFeeSummary, getFeeBalances } from '../../../utils/feeSummary';
import styles from './FeeDetails.module.css';
import {
  FiLayers,
  FiCheckCircle,
  FiClock,
  FiArrowRight,
  FiCreditCard,
} from 'react-icons/fi';

export default function FeeDetails() {
  const navigate = useNavigate();
  const { user, fees, payments, loading } = useAuth();
  const student = user?.studentData;
  const studentPayments = payments.filter(
    (payment) => payment.student?._id === student?._id || payment.student === student?._id
  );
  const summary = calculateFeeSummary(student, fees, studentPayments);
  const feeBalances = getFeeBalances(student, fees, studentPayments);

  const handlePayNow = (feeType, amount) => {
    navigate('/student/payments', {
      state: {
        amount: amount || summary.outstandingBalance,
        feeType: feeType || summary.breakdown[0]?.name || 'Tuition Fee',
      },
    });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerBanner}>
        <div>
          <h1 className={styles.pageTitle}>Fee Structure Breakdown</h1>
          <p className={styles.pageSubtitle}>
            Department: {student?.department || 'Computer Science'} • Academic Year: {student?.year || '2026'}
          </p>
        </div>
        {summary.outstandingBalance > 0 && (
          <button
            type="button"
            className={styles.proceedPayBtnHeader}
            onClick={() => handlePayNow()}
          >
            Pay All Remaining Dues <FiArrowRight />
          </button>
        )}
      </div>

      {loading ? (
        <div className={`${styles.card} glass-panel`}>Loading fee structure...</div>
      ) : (
        <>
          {/* Summary Overview Glass Banner */}
          <div className={`${styles.summaryOverviewCard} glass-panel`}>
            <div className={styles.summaryCol}>
              <span className={styles.summaryLabel}>Original Fee Structure</span>
              <span className={styles.summaryVal}>₹{summary.totalFees.toLocaleString()}</span>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.summaryCol}>
              <span className={styles.summaryLabel}>Total Paid</span>
              <span className={styles.summaryValSuccess}>₹{summary.paidAmount.toLocaleString()}</span>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.summaryCol}>
              <span className={styles.summaryLabel}>Remaining Dues</span>
              <span className={styles.summaryValWarning}>₹{summary.outstandingBalance.toLocaleString()}</span>
            </div>
          </div>

          {/* Card-Based Fee Breakdown Row List */}
          <div className={styles.sectionHeader}>
            <h2>
              <FiLayers style={{ color: '#D4A017' }} /> Prescribed Fee Items
            </h2>
          </div>

          <div className={styles.feeCardsList}>
            {feeBalances.map((fee) => {
              const isPaidOff = fee.remainingAmount <= 0;
              return (
                <div key={fee._id || fee.id} className={`${styles.feeCard} glass-panel`}>
                  <div className={styles.feeCardHeader}>
                    <div>
                      <h3 className={styles.feeName}>{fee.name}</h3>
                      <p className={styles.feeSub}>{fee.description || 'Mandatory department fee'}</p>
                    </div>
                    <span className={isPaidOff ? styles.statusPaid : styles.statusPending}>
                      {isPaidOff ? (
                        <>
                          <FiCheckCircle /> Fully Paid
                        </>
                      ) : (
                        <>
                          <FiClock /> Due: ₹{fee.remainingAmount.toLocaleString()}
                        </>
                      )}
                    </span>
                  </div>

                  <div className={styles.feeCardBody}>
                    <div className={styles.detailMetric}>
                      <span>Original Fee</span>
                      <strong>₹{fee.originalAmount.toLocaleString()}</strong>
                    </div>
                    <div className={styles.detailMetric}>
                      <span>Amount Paid</span>
                      <strong style={{ color: '#22c55e' }}>₹{fee.paidAmount.toLocaleString()}</strong>
                    </div>
                    <div className={styles.detailMetric}>
                      <span>Remaining</span>
                      <strong style={{ color: isPaidOff ? '#22c55e' : '#ef4444' }}>
                        ₹{fee.remainingAmount.toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  {!isPaidOff && (
                    <div className={styles.feeCardFooter}>
                      <button
                        type="button"
                        className={styles.proceedPayBtn}
                        onClick={() => handlePayNow(fee.name, fee.remainingAmount)}
                      >
                        Proceed to Pay ₹{fee.remainingAmount.toLocaleString()} <FiCreditCard />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {summary.breakdown.length === 0 && (
            <div className={`${styles.card} glass-panel`}>
              No fee structure items found for your department/year yet.
            </div>
          )}
        </>
      )}
    </div>
  );
}
