import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Footer.module.css';
import { FiTwitter, FiGithub, FiLinkedin, FiMail, FiPhone } from 'react-icons/fi';

const LOGO_URL = 'https://res.cloudinary.com/q2uo4xk0/image/upload/v1785232560/EDU_PAY_khxzp6.jpg';

const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <footer className={`${styles.footer} ${isHomePage ? styles.hideOnMobileHome : ''}`}>
      <div className={styles.container}>
        <div className={styles.info}>
          <div className={styles.logo}>
            <img src={LOGO_URL} alt="EduPay Logo" className={styles.logoImg} />
            <span className={styles.logoText}>EduPay</span>
          </div>
          <p className={styles.description}>
            Simplifying academic finance management for students, parents, and administrators with modern technology.
          </p>
          <div className={styles.socials}>
            <a href="#" className={styles.socialLink} aria-label="Twitter"><FiTwitter /></a>
            <a href="#" className={styles.socialLink} aria-label="GitHub"><FiGithub /></a>
            <a href="#" className={styles.socialLink} aria-label="LinkedIn"><FiLinkedin /></a>
          </div>
        </div>

        <div className={styles.mobileTwoColGrid}>
          <div className={styles.linksSection}>
            <h4 className={styles.title}>Quick Links</h4>
            <ul className={styles.list}>
              <li><Link to="/" className={styles.link}>Home</Link></li>
              <li><Link to="/about" className={styles.link}>About Us</Link></li>
              <li><Link to="/explore" className={styles.link}>Features</Link></li>
              <li><Link to="/contact" className={styles.link}>Contact</Link></li>
            </ul>
          </div>

          <div className={styles.linksSection}>
            <h4 className={styles.title}>Resources</h4>
            <ul className={styles.list}>
              <li><Link to="/payment-guide" className={styles.link}>Payment Guide</Link></li>
              <li><Link to="/student-support" className={styles.link}>Student Support</Link></li>
              <li><Link to="/fee-policies" className={styles.link}>Fee Policies</Link></li>
              <li><Link to="/helpdesk" className={styles.link}>Contact Helpdesk</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.contactInfo}>
          <h4 className={styles.title}>Get in Touch</h4>
          <ul className={styles.list}>
            <li className={styles.contactItem}>
              <FiPhone className={styles.contactIcon} />
              <span>+1 (555) 019-2834</span>
            </li>
            <li className={styles.contactItem}>
              <FiMail className={styles.contactIcon} />
              <span>support@edupay.edu</span>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <p className={styles.copy}>&copy; {new Date().getFullYear()} EduPay. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
