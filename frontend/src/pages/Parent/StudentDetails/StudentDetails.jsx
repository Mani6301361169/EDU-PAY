import React from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function StudentDetails() {
  const { students, loading } = useAuth();
  const student = students[0];

  return (
    <section>
      <h1>Student Details</h1>
      <p>View the registered student profile and fee status.</p>

      {loading ? (
        <p>Loading student details...</p>
      ) : student ? (
        <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
          <div style={{ padding: '1rem', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 25, 10, 0.9) 100%)', border: '1px solid rgba(212, 175, 55, 0.28)', color: '#f7f1d0' }}>
            <strong>{student.name}</strong>
            <div>Email: {student.email}</div>
            <div>Roll No: {student.rollNo}</div>
            <div>Department: {student.department}</div>
            <div>Year: {student.year}</div>
            <div>Fee Status: {student.feeStatus || 'Pending'}</div>
          </div>
        </div>
      ) : (
        <p>No student record found.</p>
      )}
    </section>
  );
}
