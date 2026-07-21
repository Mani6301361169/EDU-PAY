import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const cardStyle = {
  padding: '1rem',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 25, 10, 0.9) 100%)',
  border: '1px solid rgba(212, 175, 55, 0.28)',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
};

export default function Dashboard() {
  const { students, payments, fees, loading } = useAuth();
  const totalCollected = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const totalFeeValue = fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0);
  const pendingStudents = students.filter((student) => (student.feeStatus || 'Pending') !== 'Paid').length;

  return (
    <section>
      <h1>Admin Dashboard</h1>
      <p>Monitor student registrations, fee structure, and payment activity.</p>

      {loading ? (
        <p>Loading dashboard data...</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginTop: '1rem' }}>
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 0.3rem', color: '#f7f1d0' }}>Registered Students</h3>
            <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#d4af37' }}>{students.length}</p>
          </div>
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 0.3rem', color: '#f7f1d0' }}>Fees Configured</h3>
            <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#d4af37' }}>{fees.length}</p>
          </div>
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 0.3rem', color: '#f7f1d0' }}>Collected</h3>
            <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#d4af37' }}>₹{totalCollected.toLocaleString()}</p>
          </div>
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 0.3rem', color: '#f7f1d0' }}>Pending Students</h3>
            <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#f87171' }}>{pendingStudents}</p>
          </div>
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 0.3rem', color: '#f7f1d0' }}>Total Fee Value</h3>
            <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#d4af37' }}>₹{totalFeeValue.toLocaleString()}</p>
          </div>
        </div>
      )}
    </section>
  );
}
