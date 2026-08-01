import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import styles from './Fees.module.css';
import { FiPlusCircle, FiEdit, FiTrash2, FiX, FiCheckCircle, FiInbox } from 'react-icons/fi';

export default function Fees() {
  const { fees } = useAuth();
  const [feeConfigs, setFeeConfigs] = useState(() => (fees && fees.length > 0 ? fees : []));

  useEffect(() => {
    if (fees) {
      setFeeConfigs(fees);
    }
  }, [fees]);

  const [showModal, setShowModal] = useState(false);
  const [editingFee, setEditingFee] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    department: 'CSE',
    academicYear: '3rd Year',
    amount: '',
    description: '',
  });

  const handleToggleActive = (id) => {
    setFeeConfigs((prev) =>
      prev.map((item) => (item.id === id || item._id === id ? { ...item, active: !item.active } : item))
    );
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete fee configuration "${name}"?`)) {
      setFeeConfigs((prev) => prev.filter((item) => (item.id !== id && item._id !== id)));
    }
  };

  const handleSaveFee = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;

    if (editingFee) {
      setFeeConfigs((prev) =>
        prev.map((f) => ((f.id === editingFee.id || f._id === editingFee._id) ? { ...f, ...formData, amount: Number(formData.amount) } : f))
      );
    } else {
      const newFee = {
        id: `f${Date.now()}`,
        ...formData,
        amount: Number(formData.amount),
        active: true,
      };
      setFeeConfigs([newFee, ...feeConfigs]);
    }

    setShowModal(false);
    setEditingFee(null);
    setFormData({ name: '', department: 'CSE', academicYear: '3rd Year', amount: '', description: '' });
  };

  const openEdit = (fee) => {
    setEditingFee(fee);
    setFormData({
      name: fee.name,
      department: fee.department || 'CSE',
      academicYear: fee.academicYear || '3rd Year',
      amount: fee.amount,
      description: fee.description || '',
    });
    setShowModal(true);
  };

  return (
    <div className={styles.page}>
      {/* Top Header */}
      <div className={styles.topHeader}>
        <div className={styles.titleArea}>
          <h1 className={styles.mainTitle}>Fee Regulations & Structure Setup</h1>
          <p className={styles.subtitle}>
            Configure department, academic year, and tuition fee schedules across the institution
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingFee(null);
            setFormData({ name: '', department: 'CSE', academicYear: '3rd Year', amount: '', description: '' });
            setShowModal(true);
          }}
          className={styles.addBtn}
        >
          <FiPlusCircle /> Add Fee Structure
        </button>
      </div>

      {/* Fee Cards Grid */}
      {feeConfigs.length === 0 ? (
        <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#94a3b8', background: 'rgba(20, 20, 20, 0.6)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '1.5rem' }}>
          <FiInbox size={48} style={{ marginBottom: '0.75rem', opacity: 0.5, color: '#D4A017' }} />
          <h2 style={{ color: '#f7f1d0', margin: '0 0 0.5rem 0' }}>No Data Available</h2>
          <p style={{ margin: 0 }}>No fee structures configured yet. Click "Add Fee Structure" above to create a new fee regulation.</p>
        </div>
      ) : (
        <div className={styles.feesGrid}>
          {feeConfigs.map((fee) => (
            <div key={fee.id || fee._id} className={styles.feeCard}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.feeName}>{fee.name}</h3>
                  <div className={styles.metaRow} style={{ marginTop: '0.35rem' }}>
                    <span className={styles.deptTag}>{fee.department}</span>
                    <span>• {fee.academicYear}</span>
                  </div>
                </div>
                <div className={styles.feeAmount}>₹{Number(fee.amount || 0).toLocaleString()}</div>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.3rem 0 0' }}>
                {fee.description}
              </p>

              <div className={styles.cardFooter}>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleToggleActive(fee.id || fee._id)}
                  className={styles.statusActive}
                >
                  <FiCheckCircle style={{ marginRight: '0.3rem' }} />
                  {fee.active !== false ? 'Active Regulation' : 'Inactive'}
                </span>

                <div className={styles.cardActions}>
                  <button type="button" onClick={() => openEdit(fee)} className={styles.iconBtn}>
                    <FiEdit /> Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(fee.id || fee._id, fee.name)} className={styles.iconBtn}>
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Fee Modal */}
      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.cardHeader}>
              <h3 style={{ margin: 0, color: '#fff' }}>
                {editingFee ? 'Edit Fee Regulation' : 'New Fee Regulation'}
              </h3>
              <button type="button" onClick={() => setShowModal(false)} className={styles.iconBtn}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSaveFee} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <input
                type="text"
                required
                placeholder="Fee Title (e.g. Sem 6 Tuition Fee)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={styles.input}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className={styles.input}
                >
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                  <option value="Civil">Civil</option>
                  <option value="AI&DS">AI&DS</option>
                  <option value="All Depts">All Depts</option>
                </select>

                <select
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className={styles.input}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="All Years">All Years</option>
                </select>
              </div>

              <input
                type="number"
                required
                placeholder="Amount in ₹"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className={styles.input}
              />

              <input
                type="text"
                placeholder="Description & Included Facilities"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={styles.input}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.iconBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.addBtn}>
                  Save Regulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
