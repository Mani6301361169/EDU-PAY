import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import styles from './Students.module.css';
import {
  FiUserPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiKey,
  FiX,
} from 'react-icons/fi';

export default function Students() {
  
  // Local full user store for comprehensive management
  const initialUsers = [
    {
      id: 'u1',
      rollNo: '21631A0501',
      name: 'Mani Kanta',
      email: 'test@gmail.com',
      role: 'student',
      department: 'CSE',
      year: '3rd Year',
      status: 'Active',
      mobile: '+91 9876543210',
    },
    {
      id: 'u2',
      rollNo: '21631A0502',
      name: 'Priya Sharma',
      email: 'priya.sharma@college.edu',
      role: 'student',
      department: 'CSE',
      year: '2nd Year',
      status: 'Active',
      mobile: '+91 9876543211',
    },
    {
      id: 'u3',
      rollNo: 'PAR-001',
      name: 'Sanjay Sharma',
      email: 'parent@college.edu',
      role: 'parent',
      department: 'CSE',
      year: 'N/A',
      status: 'Active',
      mobile: '+91 9876500001',
    },
    {
      id: 'u4',
      rollNo: 'ACC-001',
      name: 'Mrs. Sharma',
      email: 'accountant@college.edu',
      role: 'accountant',
      department: 'Finance',
      year: 'N/A',
      status: 'Active',
      mobile: '+91 9876500002',
    },
    {
      id: 'u5',
      rollNo: 'ADM-001',
      name: 'Dr. V.K. Rao',
      email: 'admin@college.edu',
      role: 'admin',
      department: 'Administration',
      year: 'N/A',
      status: 'Active',
      mobile: '+91 9876500003',
    },
  ];

  const [usersList, setUsersList] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    department: 'CSE',
    year: '1st Year',
    mobile: '',
    rollNo: '',
  });

  // Filtered Users
  const filteredUsers = usersList.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All' || user.role === selectedRole;
    const matchesDept = selectedDept === 'All' || user.department === selectedDept;
    return matchesSearch && matchesRole && matchesDept;
  });

  const handleToggleStatus = (id) => {
    setUsersList((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } : user
      )
    );
  };

  const handleDeleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to delete user record for "${name}"?`)) {
      setUsersList((prev) => prev.filter((user) => user.id !== id));
    }
  };

  const handleResetPassword = (name, email) => {
    alert(`Password reset link dispatched to ${name} (${email}).`);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingUser) {
      setUsersList((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u))
      );
      setEditingUser(null);
    } else {
      const newUser = {
        id: `u${Date.now()}`,
        ...formData,
        status: 'Active',
      };
      setUsersList([newUser, ...usersList]);
    }

    setFormData({
      name: '',
      email: '',
      role: 'student',
      department: 'CSE',
      year: '1st Year',
      mobile: '',
      rollNo: '',
    });
    setShowAddModal(false);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      year: user.year,
      mobile: user.mobile,
      rollNo: user.rollNo,
    });
    setShowAddModal(true);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.topHeader}>
        <div className={styles.titleArea}>
          <h1 className={styles.mainTitle}>Users & Roles Control Center</h1>
          <p className={styles.subtitle}>
            Manage Students, Parents, Accountants, Admins, active statuses & system permissions
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingUser(null);
            setFormData({
              name: '',
              email: '',
              role: 'student',
              department: 'CSE',
              year: '1st Year',
              mobile: '',
              rollNo: '',
            });
            setShowAddModal(true);
          }}
          className={styles.addUserBtn}
        >
          <FiUserPlus /> Add New User
        </button>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterCard}>
        <div className={styles.searchBox}>
          <FiSearch style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by Name, Email, or ID/Roll No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className={styles.select}
          >
            <option value="All">All Roles</option>
            <option value="student">Student</option>
            <option value="parent">Parent</option>
            <option value="accountant">Accountant</option>
            <option value="admin">Administrator</option>
          </select>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className={styles.select}
          >
            <option value="All">All Depts</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
            <option value="Civil">Civil</option>
            <option value="AI&DS">AI&DS</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>ID / Roll No</th>
                <th>Name & Email</th>
                <th>Role</th>
                <th>Dept / Year</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td style={{ fontFamily: 'monospace', color: '#60a5fa', fontWeight: 600 }}>
                    {user.rollNo || 'N/A'}
                  </td>
                  <td>
                    <div className={styles.userName}>{user.name}</div>
                    <div className={styles.userEmail}>{user.email}</div>
                  </td>
                  <td>
                    <span
                      className={`${styles.roleBadge} ${
                        user.role === 'admin'
                          ? styles.roleAdmin
                          : user.role === 'accountant'
                          ? styles.roleAccountant
                          : user.role === 'parent'
                          ? styles.roleParent
                          : styles.roleStudent
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    {user.department} {user.year !== 'N/A' && `• ${user.year}`}
                  </td>
                  <td>{user.mobile}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(user.id)}
                      className={`${styles.statusToggle} ${
                        user.status === 'Active' ? styles.statusActive : styles.statusInactive
                      }`}
                    >
                      {user.status}
                    </button>
                  </td>
                  <td>
                    <div className={styles.actionsCell}>
                      <button
                        type="button"
                        onClick={() => openEditModal(user)}
                        className={styles.iconBtn}
                        title="Edit User"
                      >
                        <FiEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResetPassword(user.name, user.email)}
                        className={styles.iconBtn}
                        title="Reset Password"
                      >
                        <FiKey />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className={`${styles.iconBtn} ${styles.btnDanger}`}
                        title="Delete User"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {showAddModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingUser ? 'Edit User Record' : 'Add New System User'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className={styles.closeBtn}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSaveUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={styles.input}
                    placeholder="John Doe"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={styles.input}
                    placeholder="user@college.edu"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>System Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={styles.input}
                  >
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="accountant">Accountant</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className={styles.input}
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="ME">ME</option>
                    <option value="Civil">Civil</option>
                    <option value="AI&DS">AI&DS</option>
                    <option value="Finance">Finance</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Roll No / Staff ID</label>
                  <input
                    type="text"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className={styles.input}
                    placeholder="21631A0500"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Mobile Number</label>
                  <input
                    type="text"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className={styles.input}
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={styles.input}
                  style={{ cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.addUserBtn}
                >
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
