import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PaymentSuccess from '../../components/PaymentSuccess/PaymentSuccess';
import { downloadReceiptPDF } from '../../utils/pdfGenerator';
import styles from './PaymentSuccessPage.module.css';
import { FiArrowLeft, FiFileText, FiDownload, FiCheckCircle } from 'react-icons/fi';

export default function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const paymentState = location.state;

  useEffect(() => {
    if (!paymentState || paymentState.amount === undefined) {
      navigate('..', { replace: true });
    }
  }, [navigate, paymentState]);

  if (!paymentState || paymentState.amount === undefined) {
    return null;
  }

  const handleDownloadPDF = () => {
    downloadReceiptPDF(paymentState, user?.studentData || user);
  };

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.card} glass-panel`}>
        <PaymentSuccess
          amount={paymentState.amount}
          feeType={paymentState.feeType}
          method={paymentState.method}
        />

        <div className={styles.detailsCard}>
          <div className={styles.detailRow}>
            <span>Transaction ID</span>
            <strong>{paymentState.paymentId || `TXN-${Date.now()}`}</strong>
          </div>
          <div className={styles.detailRow}>
            <span>Fee Category</span>
            <strong>{paymentState.feeType}</strong>
          </div>
          <div className={styles.detailRow}>
            <span>Amount Paid</span>
            <strong style={{ color: '#D4A017', fontSize: '1.1rem' }}>
              ₹{Number(paymentState.amount).toLocaleString('en-IN')}
            </strong>
          </div>
          <div className={styles.detailRow}>
            <span>Status</span>
            <span className={styles.successBadge}>
              <FiCheckCircle /> SUCCESS
            </span>
          </div>
        </div>

        {/* Glossy Redesigned Action Buttons */}
        <div className={styles.actionBtnGrid}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate('..')}
          >
            <FiArrowLeft /> Back to Payments
          </button>
          <button
            type="button"
            className={styles.viewBtn}
            onClick={() => navigate('../receipts')}
          >
            <FiFileText /> View Receipts
          </button>
          <button
            type="button"
            className={styles.downloadBtn}
            onClick={handleDownloadPDF}
          >
            <FiDownload /> Download Receipt (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
