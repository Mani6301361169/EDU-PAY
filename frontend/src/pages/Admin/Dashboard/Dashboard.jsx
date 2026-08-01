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

  // Monthly collection chart data
  const revenueTrendData = [
    { month: 'Jan', revenue: 15 },
    { month: 'Feb', revenue: 28 },
    { month: 'Mar', revenue: 22 },
    { month: 'Apr', revenue: 45 },
    { month: 'May', revenue: 38 },
    { month: 'Jun', revenue: 65 },
    { month: 'Jul', revenue: 52 },
  ];

  // Department collection breakdown
  const deptBreakdown = [
    { dept: 'CSE', amount: 92, color: '#10b981' },
    { dept: 'ECE', amount: 82, color: '#6366f1' },
    { dept: 'ME', amount: 75, color: '#06b6d4' },
    { dept: 'Civil', amount: 80, color: '#f59e0b' },
    { dept: 'AI&DS', amount: 88, color: '#a855f7' },
  ];

  // System audit logs
  const auditLogs = [
    { time: '11:42:05', actor: 'Admin (Dr. V.K. Rao)', action: 'Approved Fee Concession for STU2026001', ip: '192.168.1.1' },
    { time: '10:15:30', actor: 'Accountant (Mrs. Sharma)', action: 'Verified UPI Receipt #RCP-2026-8891', ip: '192.168.1.12' },
    { time: '09:05:12', actor: 'Student (Mani Kanta)', action: 'Paid Fee ₹40,000 via Razorpay Gateway', ip: '103.12.89.44' },
    { time: '08:00:00', actor: 'System Auto-Cron', action: 'Executed 24/7 Keep-Alive Health Ping', ip: '127.0.0.1' },
  ];

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
          <p className={styles.metricSubtext}>Across 5 Departments</p>
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
          <div className={`${styles.metricValue} ${styles.valOrange}`}>₹38,50,000</div>
          <p className={styles.metricSubtext}>210 Pending Accounts</p>
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
          <div className={`${styles.metricValue} ${styles.valGreen}`}>82.4%</div>
          <p className={styles.metricSubtext}>YTD Financial Health</p>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className={styles.chartsGrid}>
        {/* Revenue Spline Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Revenue Collection Trend (2026)</h3>
          <div className={styles.chartContainer}>
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
          </div>
        </div>

        {/* Department Recovery Bar Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Dept Recovery Rate (%)</h3>
          <div className={styles.chartContainer}>
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
          </div>
        </div>
      </div>

      {/* Bottom 2-Column Section */}
      <div className={styles.bottomGrid}>
        {/* Recent Payment Settlements Table */}
        <div className={styles.sectionCard}>
          <h3 className={styles.chartTitle}>Recent Verified Payments</h3>
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
                <tr>
                  <td style={{ fontFamily: 'monospace', color: '#60a5fa' }}>RCP-2026-8891</td>
                  <td>Mani Kanta</td>
                  <td>CSE</td>
                  <td style={{ fontWeight: 700, color: '#10b981' }}>₹40,000</td>
                  <td>Razorpay UPI</td>
                  <td><span className={`${styles.statusTag} ${styles.tagVerified}`}>Verified</span></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: 'monospace', color: '#60a5fa' }}>RCP-2026-4310</td>
                  <td>Priya Sharma</td>
                  <td>CSE</td>
                  <td style={{ fontWeight: 700, color: '#10b981' }}>₹30,000</td>
                  <td>Credit Card</td>
                  <td><span className={`${styles.statusTag} ${styles.tagVerified}`}>Verified</span></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: 'monospace', color: '#60a5fa' }}>RCP-2026-1120</td>
                  <td>Rahul Reddy</td>
                  <td>ECE</td>
                  <td style={{ fontWeight: 700, color: '#f59e0b' }}>₹15,000</td>
                  <td>Net Banking</td>
                  <td><span className={`${styles.statusTag} ${styles.tagPending}`}>Pending Approval</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit & Security Log Tracker */}
        <div className={styles.sectionCard}>
          <h3 className={styles.chartTitle}>
            <FiShield style={{ color: '#60a5fa', marginRight: '0.4rem' }} /> System Audit Logs
          </h3>
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
        </div>
      </div>
    </div>
  );
}
