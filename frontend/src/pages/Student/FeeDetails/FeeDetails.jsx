import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { calculateFeeSummary } from '../../../utils/feeSummary';

export default function FeeDetails() {
  const navigate = useNavigate();
  const { user, fees, payments, loading } = useAuth();
  const student = user?.studentData;
  const summary = calculateFeeSummary(student, fees, payments.filter((payment) => payment.student?._id === student?._id || payment.student === student?._id));

  const handlePayNow = () => {
    navigate('/student/payments', {
      state: {
        amount: summary.outstandingBalance,
        feeType: summary.breakdown[0]?.name || 'Tuition Fee',
      },
    });
  };

  return (
    <section>
      <h1>Fee Structure</h1>
      <p>Your department and year-specific fee breakdown.</p>

      {loading ? (
        <p>Loading fee structure...</p>
      ) : (
        <>
          <button type="button" onClick={handlePayNow} style={{ alignSelf: 'flex-start', border: 0, borderRadius: '999px', padding: '0.7rem 1rem', background: 'linear-gradient(135deg, #d4af37 0%, #a67c00 100%)', color: '#060606', fontWeight: 700, cursor: 'pointer' }}>Pay Now</button>
          <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
            {summary.breakdown.map((fee) => (
              <div key={fee._id || fee.id} style={{ padding: '1rem', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 25, 10, 0.9) 100%)', border: '1px solid rgba(212, 175, 55, 0.28)', color: '#f7f1d0' }}>
                <strong>{fee.name}</strong>
                <div>₹{Number(fee.amount || 0).toLocaleString()}</div>
                <small>{fee.academicYear || student?.year} • {fee.description || 'Department fee'}</small>
              </div>
            ))}
          </div>
          {summary.breakdown.length === 0 && <p>No fee structure found for your department/year yet.</p>}
        </>
      )}
    </section>
  );
}
