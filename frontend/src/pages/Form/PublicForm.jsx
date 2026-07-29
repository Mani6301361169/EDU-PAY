import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import styles from './PublicForm.module.css';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function PublicForm() {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem('edupay_forms');
    const forms = saved ? JSON.parse(saved) : [];
    return (
      forms.find((f) => f.id === formId) || {
        id: formId,
        title: 'Institutional Student Registration Form',
        description: 'Please complete all required fields below to submit your registration.',
        active: true,
      }
    );
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    rollNo: '',
    dept: 'Computer Science',
    year: '1st Year',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingResponses = JSON.parse(localStorage.getItem('edupay_responses') || '[]');
    const newResponse = {
      id: `resp-${Date.now()}`,
      formId: form.id,
      formTitle: form.title,
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      rollNo: formData.rollNo,
      dept: formData.dept,
      year: formData.year,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };

    localStorage.setItem('edupay_responses', JSON.stringify([newResponse, ...existingResponses]));
    setSubmitted(true);
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.container}>
        <div className={`${styles.card} glass-panel`}>
          <div className={styles.header}>
            <span className={styles.badge}>Official Public Registration</span>
            <h1 className={styles.title}>{form.title}</h1>
            <p className={styles.desc}>{form.description}</p>
          </div>

          {!form.active ? (
            <div className={styles.inactiveMsg}>
              <FiAlertCircle style={{ fontSize: '2rem', color: '#ef4444' }} />
              <h3>This Registration Form is Currently Inactive</h3>
              <p>Please contact the institutional admin for assistance.</p>
            </div>
          ) : submitted ? (
            <div className={styles.successMsg}>
              <FiCheckCircle style={{ fontSize: '3rem', color: '#22c55e' }} />
              <h2>Application Submitted Successfully!</h2>
              <p>
                Your response for <strong>{form.title}</strong> has been received. Your registration status is currently <strong>PENDING ADMIN APPROVAL</strong>.
              </p>
              <button
                type="button"
                className={styles.homeBtn}
                onClick={() => navigate('/')}
              >
                Return to Home
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>Full Name *</label>
                  <input
                    type="text"
                    className={styles.inputField}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address *</label>
                  <input
                    type="email"
                    className={styles.inputField}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@college.edu"
                    required
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    className={styles.inputField}
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="9876543210"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Roll Number / Reg ID *</label>
                  <input
                    type="text"
                    className={styles.inputField}
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    placeholder="CS202610"
                    required
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>Department</label>
                  <select
                    className={styles.selectField}
                    value={formData.dept}
                    onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Electronics & Comm">Electronics & Comm</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Academic Year</label>
                  <select
                    className={styles.selectField}
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Submit Application
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
