import React, { useState } from 'react';
import styles from './Forms.module.css';
import {
  FiFileText,
  FiPlus,
  FiTrash2,
  FiCopy,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiToggleLeft,
  FiToggleRight,
} from 'react-icons/fi';

const INITIAL_FORMS = [
  {
    id: 'form-2026-01',
    slug: 'semester-fee-registration-2026',
    title: 'Semester Fee Registration Form 2026',
    description: 'Official online fee registration for B.Tech Computer Science & AI students.',
    active: true,
    responsesCount: 3,
    createdAt: '2026-07-28',
  },
  {
    id: 'form-2026-02',
    slug: 'hostel-and-mess-admission',
    title: 'Hostel & Mess Admission Form',
    description: 'Application for campus hostel accommodation and meal plan subscription.',
    active: true,
    responsesCount: 1,
    createdAt: '2026-07-29',
  },
];

export default function Forms() {
  const [forms, setForms] = useState(() => {
    const saved = localStorage.getItem('edupay_forms');
    return saved ? JSON.parse(saved) : INITIAL_FORMS;
  });

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const saveForms = (updated) => {
    setForms(updated);
    localStorage.setItem('edupay_forms', JSON.stringify(updated));
  };

  const handleCreateForm = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newForm = {
      id: `form-${Date.now()}`,
      slug: slug || `form-${Date.now()}`,
      title: title.trim(),
      description: desc.trim() || 'Official institutional registration form.',
      active: true,
      responsesCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    saveForms([newForm, ...forms]);
    setTitle('');
    setDesc('');
  };

  const toggleFormActive = (id) => {
    const updated = forms.map((f) => (f.id === id ? { ...f, active: !f.active } : f));
    saveForms(updated);
  };

  const handleDeleteForm = (id) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      saveForms(forms.filter((f) => f.id !== id));
    }
  };

  const handleDuplicateForm = (formItem) => {
    const dup = {
      ...formItem,
      id: `form-${Date.now()}`,
      slug: `${formItem.slug || 'form'}-copy-${Date.now()}`,
      title: `${formItem.title} (Copy)`,
      responsesCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    saveForms([dup, ...forms]);
  };

  const copyPublicLink = (formItem) => {
    const url = `${window.location.origin}/forms/${formItem.slug || formItem.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(formItem.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerBanner}>
        <div>
          <h1 className={styles.pageTitle}>Registration Forms Builder</h1>
          <p className={styles.pageSubtitle}>
            Create, publish, edit, deactivate forms and generate shareable public registration URLs.
          </p>
        </div>
      </div>

      {/* Create & Publish New Form Card */}
      <div className={`${styles.card} glass-panel`}>
        <h3>
          <FiPlus style={{ color: '#D4A017' }} /> Create & Publish Registration Form
        </h3>
        <form onSubmit={handleCreateForm} className={styles.createForm}>
          <div className={styles.inputGroup}>
            <label>Form Title *</label>
            <input
              type="text"
              className={styles.inputField}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. B.Tech Semester Fee Registration 2026"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Description / Instructions</label>
            <input
              type="text"
              className={styles.inputField}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g. Instructions for applicants..."
            />
          </div>
          <button type="submit" className={styles.submitBtn}>
            <FiPlus /> Publish Form
          </button>
        </form>
      </div>

      {/* Forms List Grid */}
      <div className={styles.formsGrid}>
        {forms.map((formItem) => (
          <div key={formItem.id} className={`${styles.formCard} glass-panel`}>
            <div className={styles.cardHeader}>
              <span className={formItem.active ? styles.badgeActive : styles.badgeInactive}>
                {formItem.active ? <FiCheckCircle /> : <FiXCircle />}{' '}
                {formItem.active ? 'PUBLISHED & ACTIVE' : 'INACTIVE'}
              </span>
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => toggleFormActive(formItem.id)}
                title="Toggle Active Status"
              >
                {formItem.active ? (
                  <FiToggleRight style={{ color: '#22c55e', fontSize: '1.5rem' }} />
                ) : (
                  <FiToggleLeft style={{ color: '#6b7280', fontSize: '1.5rem' }} />
                )}
              </button>
            </div>

            <h3 className={styles.formTitle}>{formItem.title}</h3>
            <p className={styles.formDesc}>{formItem.description}</p>

            <div className={styles.metaRow}>
              <span>Created: {formItem.createdAt}</span>
              <span>Submissions: {formItem.responsesCount || 0}</span>
            </div>

            {/* Accessible Shareable Public URL */}
            <div className={styles.publicUrlBox}>
              <code>{`${window.location.origin}/forms/${formItem.slug || formItem.id}`}</code>
              <button
                type="button"
                className={styles.copyBtn}
                onClick={() => copyPublicLink(formItem)}
              >
                <FiCopy /> {copiedId === formItem.id ? 'Copied!' : 'Copy URL'}
              </button>
            </div>

            <div className={styles.actionRow}>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => window.open(`/forms/${formItem.slug || formItem.id}`, '_blank')}
              >
                <FiEye /> Preview Public Form
              </button>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => handleDuplicateForm(formItem)}
              >
                <FiFileText /> Duplicate
              </button>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => handleDeleteForm(formItem.id)}
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
