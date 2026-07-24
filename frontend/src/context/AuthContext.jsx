import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { feeApi, paymentApi, studentApi } from '../services/api';
import { calculateFeeSummary, getFeeBalances } from '../utils/feeSummary';
import AuthContext from './authContextBase';

const formatDate = (value) => {
  if (!value) return 'No deadline set';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No deadline set';
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

const getRoleStudent = (user, students) => {
  if (!user) return null;

  if (user.role === 'student') {
    return students.find((student) => student._id === user.uid || student.email === user.email || student._id === user?.studentData?._id) || user.studentData || null;
  }

  if (user.role === 'parent') {
    return students.find((student) => student.email === 'aarav.sharma@college.edu') || students[0] || null;
  }

  return null;
};

const buildNotifications = ({ user, students, payments, fees }) => {
  const notifications = [];
  const student = getRoleStudent(user, students);

  if (user?.role === 'admin') {
    students.forEach((entry) => {
      const studentPayments = payments.filter((payment) => payment.student?._id === entry._id || payment.student === entry._id);
      const summary = calculateFeeSummary(entry, fees, studentPayments);
      const balances = getFeeBalances(entry, fees, studentPayments);

      balances.forEach((fee) => {
        if (!fee?.active || fee.remainingAmount <= 0) return;
        notifications.push({
          id: `due-${entry._id}-${fee._id}`,
          title: `${entry.name}: ${fee.name} pending`,
          message: `${entry.name} still has ₹${Number(fee.remainingAmount || 0).toLocaleString()} pending for ${fee.name}. Deadline: ${formatDate(fee.dueDate)}.`,
          amount: Number(fee.remainingAmount || 0),
          feeType: fee.name,
          dueDate: fee.dueDate,
          unread: true,
          type: 'fee-due',
        });
      });

      if (summary.outstandingBalance > 0) {
        notifications.push({
          id: `summary-${entry._id}`,
          title: `${entry.name} needs a fee payment`,
          message: `Outstanding balance is ₹${summary.outstandingBalance.toLocaleString()}. Please make the pending payment before the due date.`,
          amount: summary.outstandingBalance,
          feeType: 'Fee Summary',
          dueDate: null,
          unread: true,
          type: 'fee-overview',
        });
      }
    });

    return notifications;
  }

  if (!student) {
    return notifications;
  }

  const studentPayments = payments.filter((payment) => payment.student?._id === student._id || payment.student === student._id);
  const summary = calculateFeeSummary(student, fees, studentPayments);
  const balances = getFeeBalances(student, fees, studentPayments);

  balances.forEach((fee) => {
    if (!fee?.active || fee.remainingAmount <= 0) return;
    notifications.push({
      id: `due-${student._id}-${fee._id}`,
      title: `${fee.name} payment due`,
      message: `Please pay ₹${Number(fee.remainingAmount || 0).toLocaleString()} for ${fee.name}. Deadline: ${formatDate(fee.dueDate)}.`,
      amount: Number(fee.remainingAmount || 0),
      feeType: fee.name,
      dueDate: fee.dueDate,
      unread: true,
      type: 'fee-due',
    });
  });

  if (summary.outstandingBalance > 0) {
    notifications.push({
      id: `summary-${student._id}`,
      title: 'Fee payment still pending',
      message: `₹${summary.outstandingBalance.toLocaleString()} is still pending across your active fee records.`,
      amount: summary.outstandingBalance,
      feeType: 'Balance due',
      dueDate: null,
      unread: true,
      type: 'fee-overview',
    });
  }

  const latestPayment = [...studentPayments].sort((first, second) => new Date(second.paidAt || 0) - new Date(first.paidAt || 0))[0];
  if (latestPayment) {
    notifications.push({
      id: `receipt-${latestPayment._id}`,
      title: 'Latest payment receipt available',
      message: `Receipt generated for ₹${Number(latestPayment.amount || 0).toLocaleString()} via ${latestPayment.method || 'Online payment'}. Visit the receipts page to view it.`,
      amount: Number(latestPayment.amount || 0),
      feeType: latestPayment.feeType,
      dueDate: null,
      unread: true,
      type: 'payment-receipt',
    });
  }

  return notifications;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [readNotificationIds, setReadNotificationIds] = useState([]);

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

  const notifications = useMemo(() => {
    const items = buildNotifications({ user, students, payments, fees });
    return items.map((item) => ({
      ...item,
      unread: !readNotificationIds.includes(item.id),
    }));
  }, [fees, payments, readNotificationIds, students, user]);

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
    setReadNotificationIds((current) => (current.includes(id) ? current : [...current, id]));
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
