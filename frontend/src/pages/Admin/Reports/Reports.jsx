import React from 'react';
import styles from './Reports.module.css';
import { FiDownload, FiFileText } from 'react-icons/fi';

export default function Reports() {
  const departmentReports = [
    { dept: 'Computer Science & Engineering (CSE)', totalStudents: 450, totalBilled: 56250000, collected: 51750000, pending: 4500000, rate: '92%' },
    { dept: 'Electronics & Communication (ECE)', totalStudents: 380, totalBilled: 41800000, collected: 34276000, pending: 7524000, rate: '82%' },
    { dept: 'Mechanical Engineering (ME)', totalStudents: 220, totalBilled: 20900000, collected: 15675000, pending: 5225000, rate: '75%' },
    { dept: 'Civil Engineering (Civil)', totalStudents: 200, totalBilled: 19000000, collected: 15200000, pending: 3800000, rate: '80%' },
    { dept: 'Artificial Intelligence & Data Science (AI&DS)', totalStudents: 200, totalBilled: 28000000, collected: 23800000, pending: 4200000, rate: '85%' },
  ];

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
            ₹16.59 Crores
          </div>
          <span style={{ fontSize: '0.775rem', color: '#64748b' }}>Academic Year 2025-26</span>
        </div>

        <div className={styles.statCard}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Verified Collections</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', margin: '0.2rem 0' }}>
            ₹14.07 Crores
          </div>
          <span style={{ fontSize: '0.775rem', color: '#10b981' }}>84.8% Settlement Achieved</span>
        </div>

        <div className={styles.statCard}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Outstanding Receivables</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', margin: '0.2rem 0' }}>
            ₹2.52 Crores
          </div>
          <span style={{ fontSize: '0.775rem', color: '#f59e0b' }}>210 Accounts Pending</span>
        </div>
      </div>

      {/* Departmental Ledger Table */}
      <div className={styles.tableCard}>
        <h3 style={{ margin: '0 0 1rem', color: '#fff' }}>Departmental Revenue Recovery Ledger</h3>
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
            {departmentReports.map((row, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 700, color: '#f1f5f9' }}>{row.dept}</td>
                <td>{row.totalStudents} Students</td>
                <td>₹{row.totalBilled.toLocaleString()}</td>
                <td style={{ color: '#10b981', fontWeight: 700 }}>₹{row.collected.toLocaleString()}</td>
                <td style={{ color: '#f59e0b', fontWeight: 700 }}>₹{row.pending.toLocaleString()}</td>
                <td>
                  <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.2rem 0.55rem', borderRadius: '6px', fontWeight: 700 }}>
                    {row.rate}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
