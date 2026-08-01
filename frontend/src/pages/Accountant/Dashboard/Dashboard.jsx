import React, { useState } from 'react';
import styles from './Dashboard.module.css';
import {
  FiDownload,
  FiSend,
  FiSearch,
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

import { useAuth } from '../../../context/AuthContext';

export default function AccountantDashboard() {
  const { students, payments } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const totalStudents = students.length;
  const totalPending = students.reduce((sum, s) => sum + Number(s.pendingAmount || 0), 0);

  // Dynamic Student Fee Records from context
  const studentRecords = students.map((s) => ({
    rollNo: s.rollNo || s.studentId || 'N/A',
    name: s.name,
    dept: s.department || 'N/A',
    totalFee: Number(s.totalFees || 0),
    paid: Number(s.paidAmount || 0),
    pending: Number(s.pendingAmount || 0),
    status: s.feeStatus || (s.pendingAmount === 0 ? 'Paid' : 'Pending'),
  }));

  // Filtering records
  const filteredRecords = studentRecords.filter((record) => {
    const matchesSearch =
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || record.dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleExport = () => {
    alert('Exporting Institutional Financial Ledger (Excel/CSV)...');
  };

  const handleSendReminders = () => {
    alert(`Automated Fee Reminders dispatched to ${students.filter(s => Number(s.pendingAmount || 0) > 0).length} pending students!`);
  };

  const handleSingleReminder = (name) => {
    alert(`Fee payment reminder notification sent to ${name}!`);
  };

  return (
    <div className={styles.dashboardPage}>
      {/* Top Header */}
      <div className={styles.topHeader}>
        <div className={styles.titleArea}>
          <h1 className={styles.mainTitle}>Institutional Financial Overview</h1>
          <p className={styles.subtitle}>
            Real-time revenue monitoring, student fee management & audit log tracking
          </p>
        </div>
        <div className={styles.actionButtons}>
          <button type="button" onClick={handleExport} className={styles.exportBtn}>
            <FiDownload /> Export Excel/CSV
          </button>
          <button type="button" onClick={handleSendReminders} className={styles.reminderBtn}>
            <FiSend /> Send SMS/Email Reminders
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricTitle}>Total Enrolled Students</span>
          <div className={`${styles.metricValue} ${styles.valNeutral}`}>{totalStudents} Students</div>
          <p className={styles.metricSubtext}>Across All Departments</p>
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricTitle}>Total Payments Recorded</span>
          <div className={`${styles.metricValue} ${styles.valGreen}`}>{payments.length} Payments</div>
          <p className={styles.metricSubtext}>Recorded Transactions</p>
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricTitle}>YTD Revenue Collected</span>
          <div className={`${styles.metricValue} ${styles.valPurple}`}>₹{totalCollected.toLocaleString()}</div>
          <p className={styles.metricSubtext}>Institutional Treasury</p>
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricTitle}>Outstanding Pending Fees</span>
          <div className={`${styles.metricValue} ${styles.valOrange}`}>₹{totalPending.toLocaleString()}</div>
          <p className={styles.metricSubtext}>{students.filter(s => Number(s.pendingAmount || 0) > 0).length} Students Pending</p>
        </div>
      </div>

      {/* Middle Row Charts */}
      <div className={styles.chartsGrid}>
        {/* Collection Trend Spline Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Monthly Collection Trend (2026)</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
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
                  formatter={(value) => [`₹${value} Lakhs`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#trendGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Recovery Bar Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Department-wise Fee Recovery (%)</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <XAxis dataKey="dept" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141821',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value) => [`${value}%`, 'Recovery Rate']}
                />
                <Bar dataKey="recovery" radius={[6, 6, 0, 0]}>
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Student Fee Records Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Student Fee Records</h3>
          <div className={styles.tableControls}>
            <div className={styles.searchBox}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search Roll No or Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className={styles.deptSelect}
            >
              <option value="All">All Depts</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              <option value="Civil">Civil</option>
              <option value="AI&DS">AI&DS</option>
            </select>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.recordsTable}>
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Student Name</th>
                <th>Dept</th>
                <th>Total Fee</th>
                <th>Paid</th>
                <th>Pending</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((row, index) => (
                <tr key={index}>
                  <td className={styles.rollNo}>{row.rollNo}</td>
                  <td>{row.name}</td>
                  <td>
                    <span className={styles.deptBadge}>{row.dept}</span>
                  </td>
                  <td>₹{row.totalFee.toLocaleString()}</td>
                  <td style={{ color: '#10b981', fontWeight: 600 }}>
                    ₹{row.paid.toLocaleString()}
                  </td>
                  <td style={{ color: row.pending > 0 ? '#f59e0b' : '#94a3b8', fontWeight: 600 }}>
                    ₹{row.pending.toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={`${styles.statusTag} ${
                        row.status === 'Paid'
                          ? styles.statusPaid
                          : row.status === 'Partial'
                          ? styles.statusPartial
                          : styles.statusPending
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleSingleReminder(row.name)}
                      className={styles.tableActionBtn}
                    >
                      Reminder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Audit & Security Logs */}
      <div className={styles.logsCard}>
        <div className={styles.logsHeader}>
          <FiShield className={styles.shieldIcon} />
          <span>Real-time Audit & Security Logs</span>
        </div>
        <div className={styles.logsList}>
          {auditLogs.map((log, index) => (
            <div key={index} className={styles.logRow}>
              <div className={styles.logMain}>
                <span className={styles.logTime}>{log.time}</span>
                <span className={styles.logActor}>{log.actor}</span>
                <span className={styles.logAction}>{log.action}</span>
              </div>
              <span className={styles.logIp}>IP: {log.ip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
