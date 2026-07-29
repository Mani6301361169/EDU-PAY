import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import styles from './Responses.module.css';
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiSearch,
  FiDownload,
  FiUserCheck,
} from 'react-icons/fi';

const INITIAL_RESPONSES = [
  {
    id: 'resp-101',
    formTitle: 'Semester Fee Registration Form 2026',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    mobile: '9876543210',
    rollNo: 'CS202601',
    dept: 'Computer Science',
    year: '1st Year',
    submittedAt: '2026-07-28',
    status: 'Pending',
  },
  {
    id: 'resp-102',
    formTitle: 'Hostel & Mess Admission Form',
    name: 'Ananya Verma',
    email: 'ananya.v@college.edu',
    mobile: '9876543211',
    rollNo: 'AI202605',
    dept: 'Artificial Intelligence',
    year: '2nd Year',
    submittedAt: '2026-07-29',
    status: 'Pending',
  },
];

export default function Responses() {
  const { registerStudent } = useAuth();

  const [responses, setResponses] = useState(() => {
    const saved = localStorage.getItem('edupay_responses');
    return saved ? JSON.parse(saved) : INITIAL_RESPONSES;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [actionMsg, setActionMsg] = useState('');

  const saveResponses = (updated) => {
    setResponses(updated);
    localStorage.setItem('edupay_responses', JSON.stringify(updated));
  };

  const handleApprove = async (item) => {
    try {
      // Auto-create user account on approval with submitted role, fatherName, and password
      await registerStudent({
        name: item.name,
        fatherName: item.fatherName || '',
        email: item.email,
        mobile: item.mobile,
        rollNo: item.rollNo,
        dept: item.dept,
        year: item.year,
        role: item.role || 'student',
        password: item.password || 'Password@123',
      });

      const updated = responses.map((r) =>
        r.id === item.id ? { ...r, status: 'Approved' } : r
      );
      saveResponses(updated);
      setActionMsg(`Approved ${item.name}! Account provisioned as ${item.role || 'student'}`);
      setTimeout(() => setActionMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'Approval failed.');
    }
  };

  const handleReject = (item) => {
    const updated = responses.map((r) =>
      r.id === item.id ? { ...r, status: 'Rejected' } : r
    );
    saveResponses(updated);
    setActionMsg(`Rejected registration for ${item.name}. No account created.`);
    setTimeout(() => setActionMsg(''), 4000);
  };

  const exportCSV = () => {
    const headers = ['ID,Form Title,Name,Father Name,Email,Mobile,Roll No,Department,Year,Date,Status'];
    const rows = filteredResponses.map((r) =>
      [
        r.id,
        `"${r.formTitle}"`,
        `"${r.name}"`,
        `"${r.fatherName || ''}"`,
        r.email,
        r.mobile,
        r.rollNo,
        `"${r.dept}"`,
        r.year,
        r.submittedAt,
        r.status,
      ].join(',')
    );

    const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edupay_form_responses.csv';
    a.click();
  };

  const filteredResponses = responses.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.fatherName && r.fatherName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerBanner}>
        <div>
          <h1 className={styles.pageTitle}>Form Responses & User Approvals</h1>
          <p className={styles.pageSubtitle}>
            Review candidate applications, approve accounts, or reject invalid form submissions.
          </p>
        </div>
        <button type="button" className={styles.exportBtn} onClick={exportCSV}>
          <FiDownload /> Export CSV
        </button>
      </div>

      {actionMsg && <div className={styles.alertMsg}><FiUserCheck /> {actionMsg}</div>}

      {/* Filter and Search Bar */}
      <div className={`${styles.filterCard} glass-panel`}>
        <div className={styles.searchWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search responses by name, father's name, email, roll no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              type="button"
              className={`${styles.filterBtn} ${filterStatus === status ? styles.activeFilter : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Responses Table / Card List */}
      <div className={`${styles.tableCard} glass-panel`}>
        {filteredResponses.length === 0 ? (
          <div className={styles.emptyBox}>No responses found matching your criteria.</div>
        ) : (
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Applicant Name</th>
                  <th>Contact Info</th>
                  <th>Roll No / Dept</th>
                  <th>Form Title</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResponses.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                      {item.fatherName && <div className={styles.subText}>Father: {item.fatherName}</div>}
                    </td>
                    <td>
                      <div>{item.email}</div>
                      <div className={styles.subText}>{item.mobile}</div>
                    </td>
                    <td>
                      <div>{item.rollNo}</div>
                      <div className={styles.subText}>{item.dept} ({item.year})</div>
                    </td>
                    <td>{item.formTitle}</td>
                    <td>{item.submittedAt}</td>
                    <td>
                      <span
                        className={
                          item.status === 'Approved'
                            ? styles.badgeApproved
                            : item.status === 'Rejected'
                            ? styles.badgeRejected
                            : styles.badgePending
                        }
                      >
                        {item.status === 'Approved' ? (
                          <><FiCheckCircle /> Approved</>
                        ) : item.status === 'Rejected' ? (
                          <><FiXCircle /> Rejected</>
                        ) : (
                          <><FiClock /> Pending</>
                        )}
                      </span>
                    </td>
                    <td>
                      {item.status === 'Pending' ? (
                        <div className={styles.btnGroup}>
                          <button
                            type="button"
                            className={styles.approveBtn}
                            onClick={() => handleApprove(item)}
                          >
                            Approve & Create Account
                          </button>
                          <button
                            type="button"
                            className={styles.rejectBtn}
                            onClick={() => handleReject(item)}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className={styles.subText}>Action Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
