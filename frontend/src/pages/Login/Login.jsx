import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';
import Button from '../../components/Button/Button';
import Navbar from '../../components/Navbar/Navbar';
import { FiMail, FiLock, FiBookOpen, FiAlertCircle } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password, role);
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const autofillDemo = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'student') {
      setEmail('aarav.sharma@college.edu');
    } else if (selectedRole === 'parent') {
      setEmail('parent@college.edu');
    } else if (selectedRole === 'admin') {
      setEmail('admin@college.edu');
    }
    setPassword('password');
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.container}>
        <div className={`${styles.loginCard} glass-panel`}>
          <div className={styles.header}>
            <FiBookOpen className={styles.logoIcon} />
            <h2>Welcome Back</h2>
            <p>Access your EduPay dashboard</p>
          </div>

          {error && (
            <div className={styles.errorAlert}>
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          <div className={styles.demoAutofill}>
            <span>Autofill Demo:</span>
            <div className={styles.demoButtons}>
              <button type="button" onClick={() => autofillDemo('student')} className={styles.demoBtn}>Student</button>
              <button type="button" onClick={() => autofillDemo('parent')} className={styles.demoBtn}>Parent</button>
              <button type="button" onClick={() => autofillDemo('admin')} className={styles.demoBtn}>Admin</button>
            </div>
          </div>

          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Select Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className={styles.select}>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Email Address</label>
              <div className={styles.inputWrapper}>
                <FiMail className={styles.inputIcon} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <div className={styles.inputWrapper}>
                <FiLock className={styles.inputIcon} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <div className={styles.flexRow}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" />
                <span>Remember Me</span>
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Password reset simulation triggered.'); }} className={styles.forgot}>
                Forgot Password?
              </a>
            </div>

            <Button type="submit" variant="primary" fullWidth>
              Sign In
            </Button>
          </form>

          <div className={styles.divider}>
            <span>Or continue with</span>
          </div>

          <button onClick={() => alert('Social sign-in simulated!')} className={styles.socialBtn}>
            <FaGoogle /> Google Login
          </button>

          <p className={styles.footerText}>
            Don't have an account? <Link to="/register">Create one now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
