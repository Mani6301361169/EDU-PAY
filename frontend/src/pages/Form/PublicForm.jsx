import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import styles from './PublicForm.module.css';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiHash,
  FiBook,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiShield,
} from 'react-icons/fi';

export default function PublicForm() {
  const { formId, slug } = useParams();
  const targetKey = slug || formId;
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({
    rollNo: '',
    name: '',
    fatherName: '',
    email: '',
    role: 'student',
    dept: 'Computer Science',
    year: '1st Year',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const singleForm = JSON.parse(localStorage.getItem('edupay_single_form') || '{"active":true}');
    setForm({
      id: 'single-registration-form',
      slug: 'details',
      title: 'Institutional User Registration Form',
      description: 'Official single registration form for creating user credentials across all departments.',
      active: singleForm.active !== undefined ? singleForm.active : true,
    });
  }, [targetKey, formId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fatherName.trim()) {
      setError("Father's Name is a mandatory required field.");
      return;
    }

    // Password Match Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter identical passwords.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const existingResponses = JSON.parse(localStorage.getItem('edupay_responses') || '[]');
    const targetEmail = formData.email.toLowerCase().trim();
    const targetRoll = formData.rollNo.trim();

    // Duplicate Check across existing responses
    const isDuplicate = existingResponses.some(
      (r) =>
        (r.email && r.email.toLowerCase() === targetEmail) ||
        (r.rollNo && r.rollNo === targetRoll)
    );

    if (isDuplicate) {
      setError('A registration with this Email Address or ID/Roll Number has already been submitted.');
      return;
    }

    const newResponse = {
      id: `resp-${Date.now()}`,
      formId: form.id,
      formTitle: form.title,
      rollNo: targetRoll,
      name: formData.name.trim(),
      fatherName: formData.fatherName.trim(),
      email: targetEmail,
      role: formData.role,
      dept: formData.dept,
      year: formData.year,
      mobile: formData.mobile.trim(),
      password: formData.password, // securely handled upon approval
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };

    const updatedResponses = [newResponse, ...existingResponses];
    localStorage.setItem('edupay_responses', JSON.stringify(updatedResponses));

    setSubmitted(true);
  };

  if (!form) {
    return (
      <div className={styles.wrapper}>
        <Navbar />
        <div className={styles.container}>
          <div className={`${styles.card} glass-panel`}>
            <p>Loading application form...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.container}>
        <div className={`${styles.card} glass-panel`}>
          <div className={styles.header}>
            <span className={styles.badge}>
              <FiShield /> Official Public Registration Form
            </span>
            <h1 className={styles.title}>{form.title}</h1>
            <p className={styles.desc}>{form.description}</p>
          </div>

          {!form.active ? (
            <div className={styles.inactiveMsg}>
              <FiAlertCircle style={{ fontSize: '2.5rem', color: '#ef4444' }} />
              <h3>This Registration Form is Currently Inactive</h3>
              <p>Please contact the institutional administrator for assistance.</p>
            </div>
          ) : submitted ? (
            <div className={styles.successMsg}>
              <FiCheckCircle style={{ fontSize: '3.5rem', color: '#22c55e' }} />
              <h2>Application Submitted Successfully!</h2>
              <p>
                Your registration response for <strong>{form.title}</strong> has been received. Your registration status is currently <strong>PENDING ADMIN APPROVAL</strong>.
              </p>
              <p className={styles.subtext}>
                Once an administrator approves your submission, your login credentials will be activated automatically.
              </p>
              <button
                type="button"
                className={styles.homeBtn}
                onClick={() => navigate('/')}
              >
                Return to Home Page
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              {error && (
                <div className={styles.errorAlert}>
                  <FiAlertCircle />
                  <span>{error}</span>
                </div>
              )}

              {/* Row 1: ID / Roll Number & Full Name */}
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>1. ID / Roll Number *</label>
                  <div className={styles.inputWrapper}>
                    <FiHash className={styles.inputIcon} />
                    <input
                      type="text"
                      name="rollNo"
                      className={styles.inputField}
                      value={formData.rollNo}
                      onChange={handleChange}
                      placeholder="e.g. CS202610"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>2. Full Name *</label>
                  <div className={styles.inputWrapper}>
                    <FiUser className={styles.inputIcon} />
                    <input
                      type="text"
                      name="name"
                      className={styles.inputField}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full legal name"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Father's Name & Email Address */}
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>3. Father's Name *</label>
                  <div className={styles.inputWrapper}>
                    <FiUser className={styles.inputIcon} />
                    <input
                      type="text"
                      name="fatherName"
                      className={styles.inputField}
                      value={formData.fatherName}
                      onChange={handleChange}
                      placeholder="Enter father's full name"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>4. Email Address *</label>
                  <div className={styles.inputWrapper}>
                    <FiMail className={styles.inputIcon} />
                    <input
                      type="email"
                      name="email"
                      className={styles.inputField}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="user@college.edu"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Role & Department / Year */}
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>5. Institutional Role *</label>
                  <div className={styles.inputWrapper}>
                    <FiUser className={styles.inputIcon} />
                    <select
                      name="role"
                      className={styles.selectField}
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="student">Student</option>
                      <option value="parent">Parent</option>
                      <option value="faculty">Faculty</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>6. Department / Academic Year *</label>
                  <div className={styles.inputWrapper}>
                    <FiBook className={styles.inputIcon} />
                    <select
                      name="dept"
                      className={styles.selectField}
                      value={formData.dept}
                      onChange={handleChange}
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Electronics & Comm">Electronics & Comm</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 4: Contact Number & Password */}
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>7. Contact Number *</label>
                  <div className={styles.inputWrapper}>
                    <FiPhone className={styles.inputIcon} />
                    <input
                      type="tel"
                      name="mobile"
                      className={styles.inputField}
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="9876543210"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>8. Password *</label>
                  <div className={styles.inputWrapper}>
                    <FiLock className={styles.inputIcon} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className={styles.inputField}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={styles.eyeBtn}
                      aria-label="Toggle Password Visibility"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 5: Confirm Password */}
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>9. Confirm Password *</label>
                  <div className={styles.inputWrapper}>
                    <FiLock className={styles.inputIcon} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      className={styles.inputField}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={styles.eyeBtn}
                      aria-label="Toggle Confirm Password Visibility"
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Submit Registration Application
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
