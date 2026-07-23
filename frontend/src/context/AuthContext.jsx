import React, { useCallback, useContext, useEffect, useState } from 'react';
import { feeApi, paymentApi, studentApi } from '../services/api';
import AuthContext from './authContextBase';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [notifications, setNotifications] = useState([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [studentData, paymentData, feeData] = await Promise.all([
        studentApi.list(),
        paymentApi.list(),
        feeApi.list(),
      ]);
      setStudents(studentData);
      setPayments(paymentData);
      setFees(feeData);
      setApiError('');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Unable to reach the backend API.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const login = async (email, password, role) => {
    if (role === 'admin' && email === 'admin@college.edu') {
      const admin = { uid: 'A1', name: 'Dean Admin', email, role: 'admin' };
      setUser(admin);
      return admin;
    }
    if (role === 'parent' && email === 'parent@college.edu') {
      const parent = { uid: 'P1', name: 'Sanjay Sharma', email, role: 'parent' };
      setUser(parent);
      return parent;
    }
    const student = await studentApi.login(email, password);
    const studentUser = { uid: student._id, name: student.name, email: student.email, role: 'student', studentData: student };
    setUser(studentUser);
    return studentUser;
  };

  const registerStudent = async (data) => {
    const student = await studentApi.create({
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      rollNo: data.rollNo,
      department: data.dept || data.department,
      year: data.year,
      admissionYear: new Date().getFullYear().toString(),
      password: data.password,
    });
    setStudents((current) => [student, ...current]);
    return student;
  };

  const updateProfile = async (id, updatedInfo) => {
    const student = await studentApi.update(id, { ...updatedInfo, department: updatedInfo.dept });
    setStudents((current) => current.map((item) => item._id === id ? student : item));
    if (user?.uid === id) setUser((current) => ({ ...current, name: student.name, email: student.email, studentData: student }));
  };

  const recordPayment = async (payment) => {
    const savedPayment = await paymentApi.create(payment);
    setPayments((current) => [savedPayment, ...current]);
    await loadData();
    return savedPayment;
  };

  const markNotificationAsRead = (id) => {
    setNotifications((current) => current.map((item) => item.id === id ? { ...item, unread: false } : item));
  };

  return (
    <AuthContext.Provider value={{
      user, students, payments, fees, notifications, loading, apiError,
      login, logout: () => setUser(null), registerStudent, updateProfile,
      recordPayment, markNotificationAsRead, refreshData: loadData,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
