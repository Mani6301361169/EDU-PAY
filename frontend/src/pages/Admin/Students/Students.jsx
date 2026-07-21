import React from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function Students() {
  const { students, loading } = useAuth();

  return (
    <section>
      <h1>Students</h1>
      <p>All registered students and their fee status.</p>

      {loading ? (
        <p>Loading students...</p>
      ) : (
        <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
          {students.map((student) => (
            <div key={student._id || student.id} style={{ padding: '1rem', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 25, 10, 0.9) 100%)', border: '1px solid rgba(212, 175, 55, 0.28)', color: '#f7f1d0' }}>
              <strong>{student.name}</strong>
              <div>{student.department} • {student.year}</div>
              <div>Roll No: {student.rollNo}</div>
              <div>Fee Status: {student.feeStatus || 'Pending'}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
