import React, { useEffect, useState } from 'react';
import './PaymentSuccess.css';

export default function PaymentSuccess({ amount, feeType, method }) {
  const [phase, setPhase] = useState('processing');

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase('success'), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`payment-success ${phase === 'success' ? 'is-success' : 'is-processing'}`} role="status" aria-live="polite">
      {phase === 'success' && (
        <>
          <span className="success-particle particle-one" />
          <span className="success-particle particle-two" />
          <span className="success-particle particle-three" />
          <span className="success-particle particle-four" />
          <div className="success-icon" aria-hidden="true">
            <svg viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="23" />
              <path d="m16 27 7 7 14-16" />
            </svg>
          </div>
        </>
      )}

      {phase === 'processing' ? (
        <>
          <div className="processing-ring" aria-hidden="true" />
          <div className="copy-block">
            <p className="success-title">Processing payment</p>
            <p className="success-copy">Your transaction is being verified securely. Please wait a moment.</p>
            <div className="progress-track" aria-hidden="true">
              <span className="progress-bar" />
            </div>
          </div>
        </>
      ) : (
        <div className="copy-block">
          <p className="success-title">Payment successful</p>
          <p className="success-copy">₹{amount.toLocaleString()} paid by {method} for {feeType}.</p>
          <p className="success-foot">Receipt generated and added to your dashboard.</p>
        </div>
      )}
    </div>
  );
}
