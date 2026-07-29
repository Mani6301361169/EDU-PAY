import React from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function StudentDetails() {
  const { user, students, loading } = useAuth();

  const parentEmail = user?.email?.toLowerCase();
  const parentName = user?.name?.toLowerCase();

  const student = students.find((item) => {
    if (!item) return false;
    if (user?.childRollNo && item.rollNo === user.childRollNo) return true;
    if (
      item.fatherName &&
      (item.fatherName.toLowerCase() === parentName || parentName?.includes(item.fatherName.toLowerCase()))
    ) {
      return true;
    }
    if (item.email && parentEmail && item.email.split('@')[0] === parentEmail.split('@')[0]) return true;
    return false;
  }) || students[0];

  return (
    <section>
      <h1>Student Details</h1>
      <p>View registered student profile details linked to your account.</p>

      {loading ? (
        <p>Loading student details...</p>
      ) : student ? (
        <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
          <div style={{ padding: '1.25rem', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 25, 10, 0.9) 100%)', border: '1px solid rgba(212, 175, 55, 0.35)', color: '#f7f1d0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <strong style={{ fontSize: '1.2rem', color: '#D4A017' }}>Student Name: {student.name}</strong>
            <div><strong>Father's Name:</strong> {student.fatherName || 'Not Specified'}</div>
            <div><strong>Roll Number / ID:</strong> {student.rollNo}</div>
            <div><strong>Email Address:</strong> {student.email}</div>
            <div><strong>Department:</strong> {student.department}</div>
            <div><strong>Academic Year:</strong> {student.year}</div>
            <div><strong>Fee Payment Status:</strong> <span style={{ color: student.feeStatus === 'Paid' ? '#22c55e' : '#e2c46b', fontWeight: 'bold' }}>{student.feeStatus || 'Pending'}</span></div>
          </div>
        </div>
      ) : (
        <p>No student record found.</p>
      )}
    </section>
  );
}
