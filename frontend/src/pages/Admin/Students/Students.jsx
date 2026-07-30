import React, { useState, useEffect } from 'react';
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
  const { students, registerStudent, deleteStudent } = useAuth();
  const [usersList, setUsersList] = useState(() => (students && students.length > 0 ? students : []));

  useEffect(() => {
    if (students) {
      setUsersList(students);
    }
  }, [students]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    email: '',
    role: 'student',
    department: 'Artificial Intelligence',
    year: '1st Year',
    mobile: '',
    rollNo: '',
  });

  // Filtered Users
  const filteredUsers = usersList.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.fatherName && user.fatherName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All' || user.role === selectedRole;
    const matchesDept = selectedDept === 'All' || user.department === selectedDept;
    return matchesSearch && matchesRole && matchesDept;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Name and Email are required!');
      return;
    }
    const newUser = {
      id: `u-${Date.now()}`,
      ...formData,
      status: 'Active',
    };
    setUsersList([newUser, ...usersList]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      fatherName: user.fatherName || '',
      email: user.email,
      role: user.role,
      department: user.department,
      year: user.year,
      mobile: user.mobile,
      rollNo: user.rollNo,
    });
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    setUsersList(
      usersList.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u))
    );
    setEditingUser(null);
    resetForm();
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      setUsersList(usersList.filter((u) => u.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      fatherName: '',
      email: '',
      role: 'student',
      department: 'Artificial Intelligence',
      year: '1st Year',
      mobile: '',
      rollNo: '',
    });
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>User Management & Directory</h1>
          <p className={styles.subtitle}>
            Manage Students, Parents, Accountants, and System Administrators in one place.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className={styles.addBtn}
        >
          <FiUserPlus /> Add New User
        </button>
      </div>

      {/* Stats Quick Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{usersList.length}</div>
          <div className={styles.statLabel}>Total Accounts</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            {usersList.filter((u) => u.role === 'student').length}
          </div>
          <div className={styles.statLabel}>Students</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            {usersList.filter((u) => u.role === 'parent').length}
          </div>
          <div className={styles.statLabel}>Parents</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            {usersList.filter((u) => u.role === 'accountant').length}
          </div>
          <div className={styles.statLabel}>Accountants</div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by Name, Father's Name, Email, or ID/Roll No..."
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
            <option value="Artificial Intelligence">Artificial Intelligence</option>
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
                <th>Father's Name</th>
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
                  <td style={{ color: '#e2c46b', fontWeight: 600 }}>
                    {user.fatherName || 'Sanjay Sharma'}
                  </td>
                  <td>
                    <span
                      className={`${styles.roleBadge} ${
                        user.role === 'student'
                          ? styles.roleStudent
                          : user.role === 'parent'
                          ? styles.roleParent
                          : user.role === 'accountant'
                          ? styles.roleAccountant
                          : styles.roleAdmin
                      }`}
                    >
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className={styles.deptText}>{user.department}</div>
                    <div className={styles.yearText}>{user.year}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{user.mobile || 'N/A'}</td>
                  <td>
                    <span className={styles.statusActive}>● {user.status}</span>
                  </td>
                  <td>
                    <div className={styles.actionGroup}>
                      <button
                        title="Edit User"
                        onClick={() => handleEditClick(user)}
                        className={styles.iconBtnEdit}
                      >
                        <FiEdit />
                      </button>
                      <button
                        title="Delete User"
                        onClick={() => handleDeleteUser(user.id)}
                        className={styles.iconBtnDelete}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    No users matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Add New User Account</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className={styles.closeBtn}
              >
                <FiX />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Kishore"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Father's Name *</label>
                <input
                  type="text"
                  name="fatherName"
                  required
                  placeholder="e.g. Sanjay Sharma"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="test@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Roll Number / ID</label>
                <input
                  type="text"
                  name="rollNo"
                  placeholder="e.g. 23HT1A4309"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="student">Student</option>
                  <option value="parent">Parent</option>
                  <option value="accountant">Accountant</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  placeholder="e.g. Artificial Intelligence"
                  value={formData.department}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Year / Semester</label>
                <input
                  type="text"
                  name="year"
                  placeholder="e.g. 3rd Year"
                  value={formData.year}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Mobile Number</label>
                <input
                  type="text"
                  name="mobile"
                  placeholder="+91 9876543210"
                  value={formData.mobile}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Save & Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Edit User: {editingUser.name}</h2>
              <button
                onClick={() => setEditingUser(null)}
                className={styles.closeBtn}
              >
                <FiX />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Father's Name *</label>
                <input
                  type="text"
                  name="fatherName"
                  required
                  value={formData.fatherName}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Roll Number / ID</label>
                <input
                  type="text"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="student">Student</option>
                  <option value="parent">Parent</option>
                  <option value="accountant">Accountant</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Year / Semester</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Mobile Number</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Update User Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
