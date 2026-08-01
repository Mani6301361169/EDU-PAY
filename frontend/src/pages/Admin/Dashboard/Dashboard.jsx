import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './Dashboard.module.css';
import {
  FiUsers,
  FiDollarSign,
  FiLayers,
  FiAlertCircle,
  FiTrendingUp,
  FiDownload,
  FiPlusCircle,
  FiShield,
  FiInbox,
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { students, payments, fees } = useAuth();

  const totalCollected = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const totalStudentsCount = students.length;
  const totalFeeConfigs = fees.length;
  const totalPendingDues = students.reduce((sum, s) => sum + Number(s.pendingAmount || 0), 0);
  const totalScheduledFees = students.reduce((sum, s) => sum + Number(s.totalFees || 0), 0);

  const recoveryRate = totalScheduledFees > 0
    ? (Math.round((totalCollected / totalScheduledFees) * 1000) / 10).toFixed(1)
    : '0';

  // Dynamic Revenue Trend Chart data
  const monthlyRevenueMap = {};
  payments.forEach((p) => {
    if (!p.paidAt && !p.createdAt) return;
    const date = new Date(p.paidAt || p.createdAt);
    const monthName = date.toLocaleString('default', { month: 'short' });
    monthlyRevenueMap[monthName] = (monthlyRevenueMap[monthName] || 0) + Number(p.amount || 0);
  });

  const revenueTrendData = Object.keys(monthlyRevenueMap).map((m) => ({
    month: m,
    revenue: Math.round(monthlyRevenueMap[m] / 100000), // in Lakhs
  }));

  // Dynamic Department Recovery Breakdown
  const deptMap = {};
  students.forEach((s) => {
    const d = s.department || 'General';
    if (!deptMap[d]) {
      deptMap[d] = { total: 0, paid: 0 };
    }
    deptMap[d].total += Number(s.totalFees || 0);
    deptMap[d].paid += Number(s.paidAmount || 0);
  });

  const colors = ['#10b981', '#6366f1', '#06b6d4', '#f59e0b', '#a855f7'];
  const deptBreakdown = Object.keys(deptMap).map((dept, index) => {
    const { total, paid } = deptMap[dept];
    const rate = total > 0 ? Math.round((paid / total) * 100) : 0;
    return {
      dept,
      amount: rate,
      color: colors[index % colors.length],
    };
  });

  // Dynamic Recent Verified Payments
  const recentPayments = payments.slice(0, 5);

  // Dynamic Audit Logs
  const auditLogs = [];

  const handleExportReport = () => {
    alert('Generating Master Audit Report (Excel/CSV)...');
  };

  const handleAddFeeStructure = () => {
    navigate('/admin/fees');
  };

  const handleManageUsers = () => {
    navigate('/admin/students');
  };

  return (
    <div className={styles.dashboardPage}>
      {/* Top Header */}
      <div className={styles.topHeader}>
        <div className={styles.titleArea}>
          <h1 className={styles.mainTitle}>System Command Center</h1>
          <p className={styles.subtitle}>
            Real-time management for students, departments, fees, approvals & security audit logs
          </p>
        </div>

        <div className={styles.actionButtons}>
          <button type="button" onClick={handleAddFeeStructure} className={`${styles.actionBtn} ${styles.btnPrimary}`}>
            <FiPlusCircle /> Add Fee Structure
          </button>
          <button type="button" onClick={handleManageUsers} className={`${styles.actionBtn} ${styles.btnSecondary}`}>
            <FiUsers /> Manage Users
          </button>
          <button type="button" onClick={handleExportReport} className={`${styles.actionBtn} ${styles.btnSecondary}`}>
            <FiDownload /> Master Export
          </button>
        </div>
      </div>

      {/* 5 Real-Time Metrics Cards */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Enrolled Students</span>
            <FiUsers className={`${styles.metricIcon} ${styles.valBlue}`} />
          </div>
          <div className={`${styles.metricValue} ${styles.valNeutral}`}>{totalStudentsCount}</div>
          <p className={styles.metricSubtext}>0 Enrolled Students</p>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Fees Collected</span>
            <FiDollarSign className={`${styles.metricIcon} ${styles.valGreen}`} />
          </div>
          <div className={`${styles.metricValue} ${styles.valGreen}`}>
            ₹{totalCollected.toLocaleString()}
          </div>
          <p className={styles.metricSubtext}>Verified & Settled</p>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Outstanding Dues</span>
            <FiAlertCircle className={`${styles.metricIcon} ${styles.valOrange}`} />
          </div>
          <div className={`${styles.metricValue} ${styles.valOrange}`}>₹{totalPendingDues.toLocaleString()}</div>
          <p className={styles.metricSubtext}>{students.filter(s => Number(s.pendingAmount || 0) > 0).length} Pending Accounts</p>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Fee Structures</span>
            <FiLayers className={`${styles.metricIcon} ${styles.valPurple}`} />
          </div>
          <div className={`${styles.metricValue} ${styles.valPurple}`}>{totalFeeConfigs} Configs</div>
          <p className={styles.metricSubtext}>Active Regulations</p>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Recovery Rate</span>
            <FiTrendingUp className={`${styles.metricIcon} ${styles.valGreen}`} />
          </div>
          <div className={`${styles.metricValue} ${styles.valGreen}`}>{recoveryRate}%</div>
          <p className={styles.metricSubtext}>Financial Health</p>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className={styles.chartsGrid}>
        {/* Revenue Spline Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Revenue Collection Trend</h3>
          <div className={styles.chartContainer}>
            {revenueTrendData.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                <FiInbox size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                <span>No Data Available</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrendData}>
                  <defs>
                    <linearGradient id="adminTrendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} unit="L" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#141821',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(val) => [`₹${val} Lakhs`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#adminTrendGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Department Recovery Bar Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Dept Recovery Rate (%)</h3>
          <div className={styles.chartContainer}>
            {deptBreakdown.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                <FiInbox size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                <span>No Data Available</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptBreakdown}>
                  <XAxis dataKey="dept" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={[0, 100]} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#141821',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {deptBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Bottom 2-Column Section */}
      <div className={styles.bottomGrid}>
        {/* Recent Payment Settlements Table */}
        <div className={styles.sectionCard}>
          <h3 className={styles.chartTitle}>Recent Verified Payments</h3>
          {recentPayments.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
              <FiInbox size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
              <p>No Data Available</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Txn ID</th>
                    <th>Student</th>
                    <th>Dept</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((p) => (
                    <tr key={p._id || p.transactionId}>
                      <td style={{ fontFamily: 'monospace', color: '#60a5fa' }}>
                        {p.transactionId || String(p._id).slice(-8).toUpperCase()}
                      </td>
                      <td>{p.student?.name || 'Student'}</td>
                      <td>{p.student?.department || 'N/A'}</td>
                      <td style={{ fontWeight: 700, color: '#10b981' }}>₹{Number(p.amount).toLocaleString()}</td>
                      <td>{p.method || 'UPI'}</td>
                      <td>
                        <span className={`${styles.statusTag} ${styles.tagVerified}`}>
                          {p.status || 'Verified'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Audit & Security Log Tracker */}
        <div className={styles.sectionCard}>
          <h3 className={styles.chartTitle}>
            <FiShield style={{ color: '#60a5fa', marginRight: '0.4rem' }} /> System Audit Logs
          </h3>
          {auditLogs.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
              <FiInbox size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
              <p>No Data Available</p>
            </div>
          ) : (
            <div className={styles.auditList}>
              {auditLogs.map((log, i) => (
                <div key={i} className={styles.auditItem}>
                  <div>
                    <span style={{ color: '#60a5fa', fontWeight: 600 }}>{log.time} </span>
                    <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{log.actor}: </span>
                    <span style={{ color: '#94a3b8' }}>{log.action}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
