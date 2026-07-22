import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { calculateFeeSummary } from '../../../utils/feeSummary';
import '../../../styles/dashboardPage.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, payments, fees, loading, students } = useAuth();
  const student = students.find((item) => item.email === 'aarav.sharma@college.edu') || students[0];
  const summary = calculateFeeSummary(student, fees, payments.filter((payment) => payment.student?._id === student?._id || payment.student === student?._id));

  const handlePayNow = () => {
    navigate('/parent/payments', {
      state: {
        amount: summary.outstandingBalance,
        feeType: summary.breakdown[0]?.name || 'Tuition Fee',
      },
    });
  };

  return (
    <section className="dashboard-page">
      <h1>Parent Dashboard</h1>
      <p>Track your child&apos;s fee structure and payment progress.</p>

      {loading ? (
        <p>Loading account data...</p>
      ) : (
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Student</h3>
            <p className="value">{student?.name || user?.name || 'No student selected'}</p>
            <p className="muted">{student?.department || 'Department'} • {student?.year || 'Year'}</p>
          </div>
          <div className="dashboard-card">
            <h3>Total Fees Remaining</h3>
            <p className="value danger">₹{summary.outstandingBalance.toLocaleString()}</p>
          </div>
          <div className="dashboard-card">
            <h3>Amount Paid</h3>
            <p className="value">₹{summary.paidAmount.toLocaleString()}</p>
          </div>
          <div className="dashboard-card">
            <h3>Original Total Fee</h3>
            <p className="value">₹{summary.totalFees.toLocaleString()}</p>
            <button type="button" onClick={handlePayNow} style={{ marginTop: '0.8rem', border: 0, borderRadius: '999px', padding: '0.7rem 1rem', background: 'linear-gradient(135deg, #d4af37 0%, #a67c00 100%)', color: '#060606', fontWeight: 700, cursor: 'pointer' }}>Pay Now</button>
          </div>
        </div>
      )}
    </section>
  );
}
