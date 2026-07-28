import React from 'react';
import styles from './Home.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiShield,
  FiCpu,
  FiTrendingUp,
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className={styles.wrapper}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.heroText}
          >
            <span className={styles.badge}>Next-Gen Academic Finance</span>
            <h1>
              Simplify Your <span className="text-gradient">College Fee</span> Payments
            </h1>
            <p>
              A premium, secure, and completely digital fees management platform designed for modern
              educational institutions. Pay instantly, generate digital receipts, and track analytics.
            </p>
            <div className={styles.heroActions}>
              <Link to="/login">
                <Button variant="primary" size="large" icon={FiArrowRight}>
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} glass-panel`}>
            <h3>99.9%</h3>
            <p>Transaction Success Rate</p>
          </div>
          <div className={`${styles.statCard} glass-panel`}>
            <h3>15K+</h3>
            <p>Active Students</p>
          </div>
          <div className={`${styles.statCard} glass-panel`}>
            <h3>₹50Cr+</h3>
            <p>Fees Collected Securely</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <h2 className={styles.sectionTitle}>Key Highlights</h2>
        <div className={styles.featuresGrid}>
          <div className={`${styles.featureCard} glass-panel`}>
            <FiShield className={styles.featureIcon} />
            <h3>Secure Gateways</h3>
            <p>Simulated integration with industry leaders ensures fast and fully encrypted transfers.</p>
          </div>
          <div className={`${styles.featureCard} glass-panel`}>
            <FiCpu className={styles.featureIcon} />
            <h3>Smart Reminders</h3>
            <p>Automated alerts ensure you never miss a semester due date.</p>
          </div>
          <div className={`${styles.featureCard} glass-panel`}>
            <FiTrendingUp className={styles.featureIcon} />
            <h3>Multi-Role Dashboards</h3>
            <p>Dedicated portals allowing students, parents, accountants, and admins to manage fees effortlessly.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <h4>Secure Login</h4>
            <p>Access your designated portal (Admin, Student, Parent, Accountant) using credentials.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <h4>Check Due Fees</h4>
            <p>Review comprehensive fee structure breakups including Tuition, Mess, and Transport fees.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <h4>One-Click Pay</h4>
            <p>Complete payment using UPI, Cards, or Net Banking, and get instant digital receipts.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
