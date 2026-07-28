import React, { useState } from 'react';
import styles from './Fees.module.css';
import { FiPlusCircle, FiEdit, FiTrash2, FiX, FiCheckCircle } from 'react-icons/fi';

export default function Fees() {

  const defaultFeesList = [
    {
      id: 'f1',
      name: 'Semester 6 Tuition Fee',
      department: 'CSE',
      academicYear: '3rd Year',
      amount: 75000,
      description: 'Core Academic Instruction & Computer Lab Facilities',
      active: true,
    },
    {
      id: 'f2',
      name: 'Hostel & Mess Boarding',
      department: 'All Depts',
      academicYear: 'All Years',
      amount: 30000,
      description: 'AC Accommodation, WiFi & Dining Hall Services',
      active: true,
    },
    {
      id: 'f3',
      name: 'University Exam & Practical Lab Fee',
      department: 'ECE',
      academicYear: '2nd Year',
      amount: 12000,
      description: 'JNTUA Examination Hall Tickets & Practical Equipment',
      active: true,
    },
    {
      id: 'f4',
      name: 'Library & E-Resources Access',
      department: 'ME',
      academicYear: '1st Year',
      amount: 8000,
      description: 'IEEE Digital Access, Central Library & Cloud Labs',
      active: true,
    },
  ];

  const [feeConfigs, setFeeConfigs] = useState(defaultFeesList);
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
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete fee configuration "${name}"?`)) {
      setFeeConfigs((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSaveFee = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;

    if (editingFee) {
      setFeeConfigs((prev) =>
        prev.map((f) => (f.id === editingFee.id ? { ...f, ...formData, amount: Number(formData.amount) } : f))
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
      department: fee.department,
      academicYear: fee.academicYear,
      amount: fee.amount,
      description: fee.description,
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
      <div className={styles.feesGrid}>
        {feeConfigs.map((fee) => (
          <div key={fee.id} className={styles.feeCard}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.feeName}>{fee.name}</h3>
                <div className={styles.metaRow} style={{ marginTop: '0.35rem' }}>
                  <span className={styles.deptTag}>{fee.department}</span>
                  <span>• {fee.academicYear}</span>
                </div>
              </div>
              <div className={styles.feeAmount}>₹{fee.amount.toLocaleString()}</div>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.3rem 0 0' }}>
              {fee.description}
            </p>

            <div className={styles.cardFooter}>
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => handleToggleActive(fee.id)}
                className={styles.statusActive}
              >
                <FiCheckCircle style={{ marginRight: '0.3rem' }} />
                {fee.active ? 'Active Regulation' : 'Inactive'}
              </span>

              <div className={styles.cardActions}>
                <button type="button" onClick={() => openEdit(fee)} className={styles.iconBtn}>
                  <FiEdit /> Edit
                </button>
                <button type="button" onClick={() => handleDelete(fee.id, fee.name)} className={styles.iconBtn}>
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
