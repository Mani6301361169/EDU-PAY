import React from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function Receipts() {
  const { payments, loading } = useAuth();

  return (
    <section>
      <h1>Receipts</h1>
      <p>View your payment receipts.</p>

      {loading ? (
        <p>Loading receipts...</p>
      ) : payments.length === 0 ? (
        <p>No receipts available yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
          {payments.map((payment) => (
            <div key={payment._id || payment.id} style={{ padding: '1rem', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 25, 10, 0.9) 100%)', border: '1px solid rgba(212, 175, 55, 0.28)', color: '#f7f1d0' }}>
              <strong>Receipt #{payment._id || payment.id}</strong>
              <p>Amount: ₹{Number(payment.amount || 0).toLocaleString()}</p>
              <p>Status: {payment.status || 'Completed'}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
