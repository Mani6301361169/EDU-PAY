import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentSuccess from '../../components/PaymentSuccess/PaymentSuccess';

export default function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentState = location.state;

  useEffect(() => {
    if (!paymentState || paymentState.amount === undefined) {
      navigate('..', { replace: true });
    }
  }, [navigate, paymentState]);

  if (!paymentState || paymentState.amount === undefined) {
    return null;
  }

  return (
    <section className="page">
      <h1>Payment confirmed</h1>
      <p>Your fee payment was completed successfully.</p>

      <div className="panel" style={{ maxWidth: '640px', margin: '1.5rem auto 0' }}>
        <PaymentSuccess amount={paymentState.amount} feeType={paymentState.feeType} method={paymentState.method} />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" className="button" onClick={() => navigate('..')}>
            Back to payments
          </button>
          <button type="button" className="button" onClick={() => navigate('../receipts')}>
            View receipts
          </button>
        </div>

        <div style={{ marginTop: '1rem', color: '#d1d5db', fontSize: '0.95rem' }}>
          <p><strong>Payment ID:</strong> {paymentState.paymentId || 'N/A'}</p>
          <p><strong>Fee type:</strong> {paymentState.feeType}</p>
          <p><strong>Method:</strong> {paymentState.method}</p>
        </div>
      </div>
    </section>
  );
}
