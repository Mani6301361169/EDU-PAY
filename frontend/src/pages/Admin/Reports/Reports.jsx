import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import styles from './Reports.module.css';
import { FiDownload, FiFileText, FiInbox } from 'react-icons/fi';

export default function Reports() {
  const { students, payments } = useAuth();

  const totalBilled = students.reduce((sum, s) => sum + Number(s.totalFees || 0), 0);
  const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const totalPending = students.reduce((sum, s) => sum + Number(s.pendingAmount || 0), 0);

  const totalAccountsCount = students.length;
  const settlementPercentage = totalBilled > 0
    ? ((totalCollected / totalBilled) * 100).toFixed(1)
    : '0';

  // Group dynamically by department from registered student records in database
  const deptMap = {};
  students.forEach((s) => {
    const deptName = s.department || 'General';
    if (!deptMap[deptName]) {
      deptMap[deptName] = {
        dept: deptName,
        totalStudents: 0,
        totalBilled: 0,
        collected: 0,
        pending: 0,
      };
    }
    deptMap[deptName].totalStudents += 1;
    deptMap[deptName].totalBilled += Number(s.totalFees || 0);
    deptMap[deptName].collected += Number(s.paidAmount || 0);
    deptMap[deptName].pending += Number(s.pendingAmount || 0);
  });

  const departmentReports = Object.values(deptMap).map((d) => {
    const rateNum = d.totalBilled > 0 ? Math.round((d.collected / d.totalBilled) * 100) : 0;
    return {
      ...d,
      rate: `${rateNum}%`,
    };
  });

  const handleExportCSV = () => {
    alert('Exporting Financial Settlement Report (CSV format)...');
  };

  const handleExportPDF = () => {
    alert('Generating Official Institutional Audit Statement (PDF format)...');
  };

  return (
    <div className={styles.page}>
      <div className={styles.topHeader}>
        <div>
          <h1 className={styles.mainTitle}>Financial Audit & Revenue Reports</h1>
          <p className={styles.subtitle}>
            Comprehensive departmental revenue collection, pending ledgers & audit statements
          </p>
        </div>

        <div className={styles.exportGroup}>
          <button type="button" onClick={handleExportCSV} className={styles.exportBtn}>
            <FiDownload /> Export Excel / CSV
          </button>
          <button type="button" onClick={handleExportPDF} className={styles.exportBtn}>
            <FiFileText /> Export Audit PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className={styles.reportGrid}>
        <div className={styles.statCard}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Billed Revenue</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: '0.2rem 0' }}>
            ₹{totalBilled.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.775rem', color: '#64748b' }}>{totalAccountsCount} Registered Accounts</span>
        </div>

        <div className={styles.statCard}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Verified Collections</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', margin: '0.2rem 0' }}>
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.775rem', color: '#10b981' }}>{settlementPercentage}% Settlement Achieved</span>
        </div>

        <div className={styles.statCard}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Outstanding Receivables</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', margin: '0.2rem 0' }}>
            ₹{totalPending.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.775rem', color: '#f59e0b' }}>
            {students.filter((s) => Number(s.pendingAmount || 0) > 0).length} Accounts Pending
          </span>
        </div>
      </div>

      {/* Departmental Ledger Table */}
      <div className={styles.tableCard}>
        <h3 style={{ margin: '0 0 1rem', color: '#fff' }}>Departmental Revenue Recovery Ledger</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.reportTable}>
            <thead>
              <tr>
                <th>Department / Branch</th>
                <th>Enrolled</th>
                <th>Total Billed</th>
                <th>Collected</th>
                <th>Pending Dues</th>
                <th>Recovery Rate</th>
              </tr>
            </thead>
            <tbody>
              {departmentReports.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#94a3b8' }}>
                    <FiInbox size={42} style={{ marginBottom: '0.75rem', opacity: 0.5, color: '#D4A017' }} />
                    <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f7f1d0', marginBottom: '0.35rem' }}>
                      No Data Available
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      No departmental revenue records found in the database.
                    </div>
                  </td>
                </tr>
              ) : (
                departmentReports.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700, color: '#f1f5f9' }}>{row.dept}</td>
                    <td>{row.totalStudents} Students</td>
                    <td>₹{row.totalBilled.toLocaleString('en-IN')}</td>
                    <td style={{ color: '#10b981', fontWeight: 700 }}>₹{row.collected.toLocaleString('en-IN')}</td>
                    <td style={{ color: '#f59e0b', fontWeight: 700 }}>₹{row.pending.toLocaleString('en-IN')}</td>
                    <td>
                      <span
                        style={{
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#10b981',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          fontWeight: 700,
                        }}
                      >
                        {row.rate}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
