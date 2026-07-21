import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Register.module.css';
import Button from '../../components/Button/Button';
import Navbar from '../../components/Navbar/Navbar';
import { FiUser, FiMail, FiPhone, FiHash, FiBook, FiCalendar, FiLock, FiBookOpen } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    rollNo: '',
    dept: 'Computer Science',
    year: '1st Year',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { registerStudent } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await registerStudent(formData);
      alert('Registration successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.container}>
        <div className={`${styles.card} glass-panel`}>
          <div className={styles.header}>
            <FiBookOpen className={styles.logoIcon} />
            <h2>Create Account</h2>
            <p>Register as a new student</p>
          </div>

          {error && <div className={styles.errorAlert}>{error}</div>}

          <form onSubmit={handleRegister} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <div className={styles.inputWrapper}>
                  <FiUser className={styles.inputIcon} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Email Address</label>
                <div className={styles.inputWrapper}>
                  <FiMail className={styles.inputIcon} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@college.edu"
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Mobile Number</label>
                <div className={styles.inputWrapper}>
                  <FiPhone className={styles.inputIcon} />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="9876543210"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Roll Number</label>
                <div className={styles.inputWrapper}>
                  <FiHash className={styles.inputIcon} />
                  <input
                    type="text"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleChange}
                    placeholder="CS2025001"
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Department</label>
                <div className={styles.inputWrapper}>
                  <FiBook className={styles.inputIcon} />
                  <select name="dept" value={formData.dept} onChange={handleChange} className={styles.select}>
                    <option value="Computer Science">Computer Science</option>
                    <option value="ARTIFICIAL INTELLIGENCE">ARTIFICIAL INTELLIGENCE</option>
                    <option value="ELECTRONICS AND COMMUNICATION">ELECTRONICS AND COMMUNICATION</option>
                    <option value="CIVIL">CIVIL</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Academic Year</label>
                <div className={styles.inputWrapper}>
                  <FiCalendar className={styles.inputIcon} />
                  <select name="year" value={formData.year} onChange={handleChange} className={styles.select}>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Password</label>
                <div className={styles.inputWrapper}>
                  <FiLock className={styles.inputIcon} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Confirm Password</label>
                <div className={styles.inputWrapper}>
                  <FiLock className={styles.inputIcon} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth>
              Register Now
            </Button>
          </form>

          <p className={styles.footerText}>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
