import React, { useState } from 'react';
import styles from './Home.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, FiShield, FiCpu, FiTrendingUp, 
  FiMail, FiPhone, FiMapPin, FiChevronDown 
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const Home = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    { q: 'How secure is the online fee payment?', a: 'We use industry-standard encryption protocols. All transactions are processed through certified, highly secure gateways (like Razorpay) with PCI-DSS compliance.' },
    { q: 'Can I pay fees in installments?', a: 'Yes, our portal supports semester-wise and custom installment payments as configured by the administration.' },
    { q: 'What happens if a payment fails?', a: 'If a payment fails, any debited amount is usually refunded automatically by your bank within 5-7 working days. You can also raise a support ticket inside the dashboard.' },
    { q: 'How do I download my payment receipts?', a: 'Once a payment is successful, your digital receipt is generated instantly. You can view, download, or print it from the "Receipts" page in your dashboard.' }
  ];

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
            <h1>Simplify Your <span className="text-gradient">College Fee</span> Payments</h1>
            <p>
              A premium, secure, and completely digital fees management platform designed for modern educational institutions. Pay instantly, generate digital receipts, and track analytics.
            </p>
            <div className={styles.heroActions}>
              <Link to="/login">
                <Button variant="primary" size="large" icon={FiArrowRight}>
                  Get Started
                </Button>
              </Link>
              <a href="#features">
                <Button variant="secondary" size="large">
                  Explore Features
                </Button>
              </a>
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

      {/* College Introduction Section */}
      <section id="about" className={styles.about}>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutText}>
            <h2>About EduPay Platform</h2>
            <p>
              EduPay is an integrated institutional ecosystem that connects students, parents, and administration. We strive to eliminate lines at fee counters and administrative bottlenecks by providing instant notifications, transparent fee structures, and real-time reconciliation.
            </p>
            <ul className={styles.aboutList}>
              <li><FiShield className={styles.aboutIcon} /> Secure PCI-Compliant Payment Channels</li>
              <li><FiCpu className={styles.aboutIcon} /> Instant Ledger Reconciliation</li>
              <li><FiTrendingUp className={styles.aboutIcon} /> Interactive Analytics & Monthly Auditing Reports</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <h2 className={styles.sectionTitle}>Key Features</h2>
        <div className={styles.featuresGrid}>
          <div className={`${styles.featureCard} glass-panel`}>
            <FiShield className={styles.featureIcon} />
            <h3>Secure Gateways</h3>
            <p>Simulated integration with industry leaders ensures fast and fully encrypted transfers.</p>
          </div>
          <div className={`${styles.featureCard} glass-panel`}>
            <FiCpu className={styles.featureIcon} />
            <h3>Smart Reminders</h3>
            <p>Automated SMS and email alerts ensure you never miss a semester due date.</p>
          </div>
          <div className={`${styles.featureCard} glass-panel`}>
            <FiTrendingUp className={styles.featureIcon} />
            <h3>Parent Portal</h3>
            <p>Dedicated dashboard allowing parents to view fee structures and pay on behalf of children.</p>
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
            <p>Access your designated portal (Admin, Student, Parent) using credentials.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <h4>Check Due Fees</h4>
            <p>Review comprehensive fee structure breakups including Tuition, Mess, and Transport fees.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <h4>One-Click Pay</h4>
            <p>Complete payment using UPI, Cards, or Net Banking, and get instant receipts.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials}>
        <h2 className={styles.sectionTitle}>What Users Say</h2>
        <div className={styles.testimonialsGrid}>
          <div className={`${styles.testimonialCard} glass-panel`}>
            <p>"No more long queues! I paid my semester fees in under a minute using EduPay UPI."</p>
            <div className={styles.author}>
              <strong>Rahul Mehta</strong>
              <span>CSE Student</span>
            </div>
          </div>
          <div className={`${styles.testimonialCard} glass-panel`}>
            <p>"Extremely helpful. I can easily monitor my son's dues and download payment logs instantly."</p>
            <div className={styles.author}>
              <strong>Sanjay Sharma</strong>
              <span>Parent</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq}>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div className={styles.faqContainer}>
          {faqs.map((faq, index) => (
            <div key={index} className={`${styles.faqItem} glass-panel`} onClick={() => toggleFaq(index)}>
              <div className={styles.faqHeader}>
                <h4>{faq.q}</h4>
                <FiChevronDown className={`${styles.faqChevron} ${activeFaq === index ? styles.faqChevronRotate : ''}`} />
              </div>
              {activeFaq === index && (
                <div className={styles.faqBody}>
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={styles.contact}>
        <h2 className={styles.sectionTitle}>Contact Support</h2>
        <div className={styles.contactContainer}>
          <div className={`${styles.contactCard} glass-panel`}>
            <h3>Office Address</h3>
            <p><FiMapPin /> chalapathi university </p>
            <p><FiPhone /> +91 6301361169</p>
            <p><FiMail /> maishnakar@edupay.edu</p>
          </div>
          <form className={`${styles.contactForm} glass-panel`} onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
            <input type="text" placeholder="Your Name" required className={styles.input} />
            <input type="email" placeholder="Your Email" required className={styles.input} />
            <textarea placeholder="Your Message" rows="5" required className={styles.textarea}></textarea>
            <Button type="submit" variant="primary" fullWidth>Send Message</Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
