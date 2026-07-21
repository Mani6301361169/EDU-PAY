import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import styles from './Fees.module.css';

export default function Fees() {
  const { fees, loading, refreshData } = useAuth();
  const [form, setForm] = useState({ name: '', amount: '', department: 'Computer Science', academicYear: '1st Year', description: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    await api.post('/fees', {
      ...form,
      amount: Number(form.amount),
      active: true,
    });
    setForm({ name: '', amount: '', department: 'Computer Science', academicYear: '1st Year', description: '' });
    setMessage('Fee structure updated successfully.');
    await refreshData();
  };

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1>Fee Structure</h1>
        <p>Department and year-wise fee structure for every student.</p>
      </div>

      <div className={styles.panel}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input className={styles.input} type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Fee name" required />
          <input className={styles.input} type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Amount" required />
          <select className={styles.select} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
            <option value="Computer Science">Computer Science</option>
            <option value="ARTIFICIAL INTELLIGENCE">ARTIFICIAL INTELLIGENCE</option>
            <option value="ELECTRONICS AND COMMUNICATION">ELECTRONICS AND COMMUNICATION</option>
            <option value="CIVIL">CIVIL</option>
          </select>
          <select className={styles.select} value={form.academicYear} onChange={(e) => setForm({ ...form, academicYear: e.target.value })}>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
          <input className={styles.input} type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" />
          <button className={styles.button} type="submit">Save Fee Structure</button>
        </form>
      </div>

      {message && <p className={styles.message}>{message}</p>}

      {loading ? (
        <p>Loading fee structure...</p>
      ) : (
        <div className={styles.list}>
          {fees.map((fee) => (
            <div key={fee._id || fee.id} className={styles.card}>
              <div className={styles.cardTitle}>{fee.name}</div>
              <div className={styles.cardAmount}>₹{Number(fee.amount || 0).toLocaleString()}</div>
              <div className={styles.cardMeta}>Department: {fee.department || 'All'}</div>
              <div className={styles.cardMeta}>Academic Year: {fee.academicYear || 'All'}</div>
              <div className={styles.cardMeta}>{fee.description || 'Fees for the selected department and year.'}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
