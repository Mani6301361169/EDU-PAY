import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import styles from './Contact.module.css';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiMessageSquare } from 'react-icons/fi';

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      alert('Thank you for reaching out! Our accounts helpdesk will respond shortly.');
      setFormSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 500);
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.container}>
        {/* Single Premium Glassmorphism Container */}
        <div className={`${styles.unifiedGlassContainer} glass-panel`}>
          <div className={styles.headerArea}>
            <span className={styles.badge}>24/7 Accounts Support</span>
            <h1 className={styles.title}>
              Contact <span className={styles.highlight}>EduPay</span> Support
            </h1>
            <p className={styles.supportDesc}>
              Have questions regarding fee structures, online payments, bank reconciliation, or student account access? Reach out to our dedicated accounts helpdesk team below.
            </p>
          </div>

          <div className={styles.unifiedContentGrid}>
            {/* Left Column: Direct Contact Info */}
            <div className={styles.contactDetailsColumn}>
              <div className={styles.infoBox}>
                <div className={styles.iconCircle}>
                  <FiMail className={styles.icon} />
                </div>
                <div>
                  <p className={styles.infoTitle}>Email Support</p>
                  <p className={styles.infoText}>maishnakar@edupay.edu</p>
                  <p className={styles.infoSubtext}>support@college.edu</p>
                </div>
              </div>

              <div className={styles.infoBox}>
                <div className={styles.iconCircle}>
                  <FiPhone className={styles.icon} />
                </div>
                <div>
                  <p className={styles.infoTitle}>Helpline Number</p>
                  <p className={styles.infoText}>+91 6301361169</p>
                  <p className={styles.infoSubtext}>Mon - Sat: 9:00 AM - 5:00 PM</p>
                </div>
              </div>

              <div className={styles.infoBox}>
                <div className={styles.iconCircle}>
                  <FiMapPin className={styles.icon} />
                </div>
                <div>
                  <p className={styles.infoTitle}>Campus Address</p>
                  <p className={styles.infoText}>Chalapathi University Campus</p>
                  <p className={styles.infoSubtext}>Central Accounts & Finance Block</p>
                </div>
              </div>

              <div className={styles.infoBox}>
                <div className={styles.iconCircle}>
                  <FiClock className={styles.icon} />
                </div>
                <div>
                  <p className={styles.infoTitle}>Helpdesk Hours</p>
                  <p className={styles.infoText}>9:00 AM - 5:30 PM (IST)</p>
                  <p className={styles.infoSubtext}>Sunday & Public Holidays Closed</p>
                </div>
              </div>
            </div>

            {/* Right Column: Support Message Form */}
            <div className={styles.formColumn}>
              <h3 className={styles.formTitle}>
                <FiMessageSquare /> Send Direct Support Inquiry
              </h3>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="student@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Subject / Topic</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Payment receipt query"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Message Details</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Describe your issue or query..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={styles.textarea}
                  ></textarea>
                </div>

                <Button type="submit" variant="primary" fullWidth disabled={formSubmitted} icon={FiSend}>
                  {formSubmitted ? 'Sending Message...' : 'Submit Inquiry'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
