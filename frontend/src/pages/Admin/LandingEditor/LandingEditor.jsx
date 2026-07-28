import React, { useState } from 'react';
import styles from './LandingEditor.module.css';
import {
  FiEye,
  FiSave,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiX,
  FiHome,
  FiInfo,
  FiMail,
  FiAward,
  FiBell,
} from 'react-icons/fi';

export default function LandingEditor() {
  const [activeTab, setActiveTab] = useState('home');
  const [showPreview, setShowPreview] = useState(false);

  // Home / Hero Content State
  const [homeData, setHomeData] = useState({
    heroBadge: 'Next-Gen Academic Finance',
    heroTitle: 'Simplify Your College Fee Payments',
    heroSubtitle:
      'A premium, secure, and completely digital fees management platform designed for modern educational institutions.',
    ctaPrimaryText: 'Get Started',
    ctaPrimaryLink: '/login',
    ctaSecondaryText: 'Explore Features',
    ctaSecondaryLink: '/about',
    enabled: true,
  });

  // About Page Content State
  const [aboutData, setAboutData] = useState({
    pageTitle: 'About EduPay Portal',
    portalDescription:
      'EduPay is an integrated institutional ecosystem that connects students, parents, and administration. We strive to eliminate lines at fee counters and administrative bottlenecks by providing instant notifications, transparent fee structures, and real-time reconciliation.',
    transparencyRate: '100%',
    uptimeText: '24/7',
    activeDepartments: '5+',
    enabled: true,
  });

  // Contact Page Content State
  const [contactData, setContactData] = useState({
    pageTitle: 'Contact EduPay Support',
    supportDescription:
      'Have questions regarding fee structures, online payments, or account access? Reach out to our accounts helpdesk.',
    email: 'support@college.edu',
    phone: '+91 6301361169',
    address: 'Chalapathi University Campus, Accounts Block',
    enabled: true,
  });

  // Announcements Banner State
  const [announcementData, setAnnouncementData] = useState({
    enabled: true,
    bannerText: 'Semester VI Fee Submission Deadline extended to 15-Aug-2026. Avoid late fines!',
    linkText: 'Pay Now',
  });

  // Features List State
  const [featuresList, setFeaturesList] = useState([
    {
      id: 'f1',
      title: 'Secure PCI-DSS Gateways',
      description: 'Encrypted transfer protocols with certified payment gateways.',
      enabled: true,
    },
    {
      id: 'f2',
      title: 'Instant Ledger Reconciliation',
      description: 'Real-time database updates and automated digital receipt generation.',
      enabled: true,
    },
    {
      id: 'f3',
      title: 'Multi-Role Dashboards',
      description: 'Tailored interfaces for Students, Parents, Accountants, and Administrators.',
      enabled: true,
    },
  ]);

  const [newFeatureTitle, setNewFeatureTitle] = useState('');
  const [newFeatureDesc, setNewFeatureDesc] = useState('');

  const handleAddFeature = (e) => {
    e.preventDefault();
    if (!newFeatureTitle) return;
    const newItem = {
      id: `f_${Date.now()}`,
      title: newFeatureTitle,
      description: newFeatureDesc || 'Feature description',
      enabled: true,
    };
    setFeaturesList([...featuresList, newItem]);
    setNewFeatureTitle('');
    setNewFeatureDesc('');
  };

  const handleDeleteFeature = (id) => {
    setFeaturesList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleFeature = (id) => {
    setFeaturesList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const handleSaveAll = () => {
    alert('All landing website updates published successfully!');
  };

  return (
    <div className={styles.page}>
      {/* Top Header */}
      <div className={styles.topHeader}>
        <div className={styles.titleArea}>
          <h1 className={styles.mainTitle}>Landing Website Content Editor</h1>
          <p className={styles.subtitle}>
            Manage hero banners, about section, contact info, feature cards, and announcements in real-time
          </p>
        </div>

        <div className={styles.headerActions}>
          <button type="button" onClick={() => setShowPreview(true)} className={styles.previewBtn}>
            <FiEye /> Live Preview
          </button>
          <button type="button" onClick={handleSaveAll} className={styles.publishBtn}>
            <FiSave /> Publish Updates
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabsContainer}>
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`${styles.tabBtn} ${activeTab === 'home' ? styles.activeTab : ''}`}
        >
          <FiHome /> Home & Hero
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`${styles.tabBtn} ${activeTab === 'about' ? styles.activeTab : ''}`}
        >
          <FiInfo /> About Page
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`${styles.tabBtn} ${activeTab === 'contact' ? styles.activeTab : ''}`}
        >
          <FiMail /> Contact Page
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('features')}
          className={`${styles.tabBtn} ${activeTab === 'features' ? styles.activeTab : ''}`}
        >
          <FiAward /> Key Features
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('announcements')}
          className={`${styles.tabBtn} ${activeTab === 'announcements' ? styles.activeTab : ''}`}
        >
          <FiBell /> Announcements
        </button>
      </div>

      {/* Tab Content: Home & Hero */}
      {activeTab === 'home' && (
        <div className={styles.editorCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              <FiHome /> Home Page Hero & Call-to-Action Settings
            </h3>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={homeData.enabled}
                onChange={(e) => setHomeData({ ...homeData, enabled: e.target.checked })}
              />
              Section Enabled
            </label>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Hero Badge Text</label>
              <input
                type="text"
                value={homeData.heroBadge}
                onChange={(e) => setHomeData({ ...homeData, heroBadge: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Main Headline</label>
              <input
                type="text"
                value={homeData.heroTitle}
                onChange={(e) => setHomeData({ ...homeData, heroTitle: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label>Hero Subtitle Description</label>
              <textarea
                rows="3"
                value={homeData.heroSubtitle}
                onChange={(e) => setHomeData({ ...homeData, heroSubtitle: e.target.value })}
                className={styles.textarea}
              ></textarea>
            </div>

            <div className={styles.formGroup}>
              <label>Primary CTA Button Label</label>
              <input
                type="text"
                value={homeData.ctaPrimaryText}
                onChange={(e) => setHomeData({ ...homeData, ctaPrimaryText: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Secondary CTA Button Label</label>
              <input
                type="text"
                value={homeData.ctaSecondaryText}
                onChange={(e) => setHomeData({ ...homeData, ctaSecondaryText: e.target.value })}
                className={styles.input}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: About Page */}
      {activeTab === 'about' && (
        <div className={styles.editorCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              <FiInfo /> Dedicated About Page Content
            </h3>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={aboutData.enabled}
                onChange={(e) => setAboutData({ ...aboutData, enabled: e.target.checked })}
              />
              Section Enabled
            </label>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label>About Page Main Heading</label>
              <input
                type="text"
                value={aboutData.pageTitle}
                onChange={(e) => setAboutData({ ...aboutData, pageTitle: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label>Platform Overview Text</label>
              <textarea
                rows="4"
                value={aboutData.portalDescription}
                onChange={(e) => setAboutData({ ...aboutData, portalDescription: e.target.value })}
                className={styles.textarea}
              ></textarea>
            </div>

            <div className={styles.formGroup}>
              <label>Transparency Metric</label>
              <input
                type="text"
                value={aboutData.transparencyRate}
                onChange={(e) => setAboutData({ ...aboutData, transparencyRate: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Online Payment Availability</label>
              <input
                type="text"
                value={aboutData.uptimeText}
                onChange={(e) => setAboutData({ ...aboutData, uptimeText: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Active Departments Metric</label>
              <input
                type="text"
                value={aboutData.activeDepartments}
                onChange={(e) => setAboutData({ ...aboutData, activeDepartments: e.target.value })}
                className={styles.input}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Contact Page */}
      {activeTab === 'contact' && (
        <div className={styles.editorCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              <FiMail /> Dedicated Contact Page Content
            </h3>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={contactData.enabled}
                onChange={(e) => setContactData({ ...contactData, enabled: e.target.checked })}
              />
              Section Enabled
            </label>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Contact Page Title</label>
              <input
                type="text"
                value={contactData.pageTitle}
                onChange={(e) => setContactData({ ...contactData, pageTitle: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Support Contact Email</label>
              <input
                type="email"
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Helpline Phone Number</label>
              <input
                type="text"
                value={contactData.phone}
                onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Campus Address Location</label>
              <input
                type="text"
                value={contactData.address}
                onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label>Helpdesk Subtitle Description</label>
              <textarea
                rows="3"
                value={contactData.supportDescription}
                onChange={(e) =>
                  setContactData({ ...contactData, supportDescription: e.target.value })
                }
                className={styles.textarea}
              ></textarea>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Key Features */}
      {activeTab === 'features' && (
        <div className={styles.editorCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              <FiAward /> Manage Feature Highlights
            </h3>
          </div>

          {/* Add New Feature Form */}
          <form onSubmit={handleAddFeature} className={styles.formGrid} style={{ marginBottom: '1rem' }}>
            <div className={styles.formGroup}>
              <label>New Feature Title</label>
              <input
                type="text"
                placeholder="e.g. Automated Receipt Dispatch"
                value={newFeatureTitle}
                onChange={(e) => setNewFeatureTitle(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Feature Description</label>
              <input
                type="text"
                placeholder="e.g. Instant PDF generation sent via SMS/Email"
                value={newFeatureDesc}
                onChange={(e) => setNewFeatureDesc(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup} style={{ justifyContent: 'flex-end' }}>
              <button type="submit" className={styles.publishBtn}>
                <FiPlus /> Add Feature Item
              </button>
            </div>
          </form>

          {/* Existing Features List */}
          <div className={styles.itemList}>
            {featuresList.map((item) => (
              <div key={item.id} className={styles.itemRow}>
                <div className={styles.itemMain}>
                  <span className={styles.itemTitle}>{item.title}</span>
                  <span className={styles.itemDesc}>{item.description}</span>
                </div>
                <div className={styles.itemActions}>
                  <button
                    type="button"
                    onClick={() => handleToggleFeature(item.id)}
                    className={styles.iconBtn}
                    style={{ color: item.enabled ? '#10b981' : '#64748b' }}
                  >
                    {item.enabled ? <FiCheck /> : <FiX />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteFeature(item.id)}
                    className={`${styles.iconBtn} ${styles.btnDanger}`}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Announcements Banner */}
      {activeTab === 'announcements' && (
        <div className={styles.editorCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              <FiBell /> Top Announcement & Notice Banner
            </h3>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={announcementData.enabled}
                onChange={(e) =>
                  setAnnouncementData({ ...announcementData, enabled: e.target.checked })
                }
              />
              Banner Active
            </label>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label>Announcement Notice Text</label>
              <input
                type="text"
                value={announcementData.bannerText}
                onChange={(e) =>
                  setAnnouncementData({ ...announcementData, bannerText: e.target.value })
                }
                className={styles.input}
              />
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {showPreview && (
        <div className={styles.previewModal}>
          <div className={styles.previewHeader}>
            <h3 style={{ margin: 0, color: '#D4A017' }}>Live Website Landing Preview</h3>
            <button type="button" onClick={() => setShowPreview(false)} className={styles.previewBtn}>
              <FiX /> Close Preview
            </button>
          </div>
          <div className={styles.previewBody}>
            <span style={{ fontSize: '0.75rem', color: '#D4A017', fontWeight: 700 }}>
              {homeData.heroBadge}
            </span>
            <h1 style={{ fontSize: '2.5rem', color: '#fff', margin: '0.5rem 0' }}>
              {homeData.heroTitle}
            </h1>
            <p style={{ color: '#94a3b8', maxWidth: '600px', fontSize: '1rem' }}>
              {homeData.heroSubtitle}
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <button className={styles.publishBtn}>{homeData.ctaPrimaryText}</button>
              <button className={styles.previewBtn}>{homeData.ctaSecondaryText}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
