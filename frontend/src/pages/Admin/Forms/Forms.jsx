import React, { useState } from 'react';
import styles from './Forms.module.css';
import {
  FiFileText,
  FiPlus,
  FiEdit,
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
    title: 'Semester Fee Registration Form 2026',
    description: 'Official online fee registration for B.Tech Computer Science & AI students.',
    active: true,
    responsesCount: 3,
    createdAt: '2026-07-28',
  },
  {
    id: 'form-2026-02',
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

    const newForm = {
      id: `form-${Date.now()}`,
      title,
      description: desc || 'Custom institutional application form.',
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

  const handleDuplicateForm = (form) => {
    const dup = {
      ...form,
      id: `form-${Date.now()}`,
      title: `${form.title} (Copy)`,
      responsesCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    saveForms([dup, ...forms]);
  };

  const copyPublicLink = (formId) => {
    const url = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(formId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerBanner}>
        <div>
          <h1 className={styles.pageTitle}>Registration Forms Builder</h1>
          <p className={styles.pageSubtitle}>
            Create, manage, activate/deactivate forms and generate public registration links.
          </p>
        </div>
      </div>

      {/* Create New Form Card */}
      <div className={`${styles.card} glass-panel`}>
        <h3>
          <FiPlus style={{ color: '#D4A017' }} /> Create New Registration Form
        </h3>
        <form onSubmit={handleCreateForm} className={styles.createForm}>
          <div className={styles.inputGroup}>
            <label>Form Title</label>
            <input
              type="text"
              className={styles.inputField}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 2026 Academic Fee Registration"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Description / Guidelines</label>
            <input
              type="text"
              className={styles.inputField}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g. Instructions for applicants..."
            />
          </div>
          <button type="submit" className={styles.submitBtn}>
            <FiPlus /> Create Form
          </button>
        </form>
      </div>

      {/* Forms List Grid */}
      <div className={styles.formsGrid}>
        {forms.map((form) => (
          <div key={form.id} className={`${styles.formCard} glass-panel`}>
            <div className={styles.cardHeader}>
              <span className={form.active ? styles.badgeActive : styles.badgeInactive}>
                {form.active ? <FiCheckCircle /> : <FiXCircle />}{' '}
                {form.active ? 'ACTIVE' : 'INACTIVE'}
              </span>
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => toggleFormActive(form.id)}
                title="Toggle Active Status"
              >
                {form.active ? (
                  <FiToggleRight style={{ color: '#22c55e', fontSize: '1.5rem' }} />
                ) : (
                  <FiToggleLeft style={{ color: '#6b7280', fontSize: '1.5rem' }} />
                )}
              </button>
            </div>

            <h3 className={styles.formTitle}>{form.title}</h3>
            <p className={styles.formDesc}>{form.description}</p>

            <div className={styles.metaRow}>
              <span>Created: {form.createdAt}</span>
              <span>Submissions: {form.responsesCount}</span>
            </div>

            <div className={styles.publicUrlBox}>
              <code>{`${window.location.origin}/form/${form.id}`}</code>
              <button
                type="button"
                className={styles.copyBtn}
                onClick={() => copyPublicLink(form.id)}
              >
                <FiCopy /> {copiedId === form.id ? 'Copied!' : 'Copy Link'}
              </button>
            </div>

            <div className={styles.actionRow}>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => window.open(`/form/${form.id}`, '_blank')}
              >
                <FiEye /> Preview Public Form
              </button>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => handleDuplicateForm(form)}
              >
                <FiFileText /> Duplicate
              </button>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => handleDeleteForm(form.id)}
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
