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
    return (
      students.find(
        (student) =>
          student._id === user.uid ||
          student.email === user.email ||
          (user.rollNo && student.rollNo === user.rollNo) ||
          student._id === user?.studentData?._id
      ) || user.studentData || null
    );
  }

  if (user.role === 'parent') {
    const parentEmail = user.email?.toLowerCase();
    const parentName = user.name?.toLowerCase();
    const parentFatherName = user.fatherName?.toLowerCase();

    return (
      students.find((student) => {
        if (!student) return false;
        // Match by student Roll Number if assigned
        if (user.childRollNo && student.rollNo === user.childRollNo) return true;
        // Match by Father's Name
        if (
          student.fatherName &&
          (student.fatherName.toLowerCase() === parentName ||
            student.fatherName.toLowerCase() === parentFatherName ||
            parentName?.includes(student.fatherName.toLowerCase()))
        ) {
          return true;
        }
        // Match by linked email
        if (student.parentEmail && student.parentEmail.toLowerCase() === parentEmail) return true;
        if (student.email && parentEmail && student.email.split('@')[0] === parentEmail.split('@')[0]) return true;
        return false;
      }) || students[0] || null
    );
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
          feeType: 'Total Outstanding Balance',
          dueDate: summary.nextDueDate,
          unread: true,
          type: 'fee-due',
        });
      }
    });

    return notifications;
  }

  if (!student) return [];

  const studentPayments = payments.filter(
    (payment) => payment.student?._id === student._id || payment.student === student._id
  );
  const summary = calculateFeeSummary(student, fees, studentPayments);
  const balances = getFeeBalances(student, fees, studentPayments);

  balances.forEach((fee) => {
    if (!fee?.active || fee.remainingAmount <= 0) return;
    notifications.push({
      id: `due-${fee._id}`,
      title: `${fee.name} pending`,
      message: `₹${Number(fee.remainingAmount || 0).toLocaleString()} remaining for ${fee.name}. Due date: ${formatDate(fee.dueDate)}.`,
      amount: Number(fee.remainingAmount || 0),
      feeType: fee.name,
      dueDate: fee.dueDate,
      unread: true,
      type: 'fee-due',
    });
  });

  if (summary.outstandingBalance > 0) {
    notifications.push({
      id: 'summary-balance',
      title: 'Outstanding Fee Balance',
      message: `Total remaining balance to clear is ₹${summary.outstandingBalance.toLocaleString()}. Due by ${formatDate(summary.nextDueDate)}.`,
      amount: summary.outstandingBalance,
      feeType: 'Total Outstanding Balance',
      dueDate: summary.nextDueDate,
      unread: true,
      type: 'fee-due',
    });
  }

  studentPayments.slice(0, 3).forEach((payment) => {
    notifications.push({
      id: `payment-${payment._id || payment.transactionId}`,
      title: 'Payment Confirmation',
      message: `₹${Number(payment.amount || 0).toLocaleString()} paid for ${payment.feeType || 'College Fees'} on ${formatDate(payment.paidAt || payment.createdAt)}.`,
      amount: Number(payment.amount || 0),
      feeType: payment.feeType || 'College Fees',
      paidAt: payment.paidAt || payment.createdAt,
      unread: false,
      type: 'payment-success',
    });
  });

  return notifications;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('edupay_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('edupay_students');
    return saved ? JSON.parse(saved) : [];
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('edupay_payments');
    return saved ? JSON.parse(saved) : [];
  });

  const [fees, setFees] = useState(() => {
    const saved = localStorage.getItem('edupay_fees');
    return saved ? JSON.parse(saved) : [];
  });

  const [readNotificationIds, setReadNotificationIds] = useState(() => {
    const saved = localStorage.getItem('edupay_read_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('edupay_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('edupay_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('edupay_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('edupay_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('edupay_fees', JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem('edupay_read_notifications', JSON.stringify(readNotificationIds));
  }, [readNotificationIds]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setApiError(null);

    try {
      const [fetchedStudents, fetchedFees, fetchedPayments] = await Promise.all([
        studentApi.list().catch(() => []),
        feeApi.list().catch(() => []),
        paymentApi.list().catch(() => []),
      ]);

      if (Array.isArray(fetchedStudents) && fetchedStudents.length > 0) {
        setStudents(fetchedStudents);
      }
      if (Array.isArray(fetchedFees) && fetchedFees.length > 0) {
        setFees(fetchedFees);
      }
      if (Array.isArray(fetchedPayments) && fetchedPayments.length > 0) {
        setPayments(fetchedPayments);
      }
    } catch (err) {
      console.warn('API error, using local state:', err);
      setApiError('Operating in local state mode.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const login = async (email, password, role) => {
    const targetEmail = email?.toLowerCase()?.trim();

    if (role === 'admin') {
      const admin = { uid: 'A1', name: 'Dean Admin', email: targetEmail, role: 'admin' };
      setUser(admin);
      return admin;
    }
    if (role === 'accountant') {
      const accountant = { uid: 'ACC1', name: 'Mrs. Sharma (Accountant)', email: targetEmail, role: 'accountant' };
      setUser(accountant);
      return accountant;
    }
    if (role === 'parent') {
      const matchedStudent = students.find((s) => s.email?.toLowerCase() === targetEmail || (s.fatherName && s.fatherName.trim() !== '')) || students[0];
      const parentFatherName = matchedStudent?.fatherName || 'Ramesh Kumar';
      const parent = {
        uid: 'P1',
        name: parentFatherName,
        fatherName: parentFatherName,
        email: targetEmail,
        role: 'parent',
        childRollNo: matchedStudent?.rollNo,
      };
      setUser(parent);
      return parent;
    }

    try {
      const student = await studentApi.login(email, password);
      const studentUser = { uid: student._id, name: student.name, email: student.email, role: 'student', studentData: student };
      setUser(studentUser);
      return studentUser;
    } catch (_error) {
      const matched = students.find((s) => s.email?.toLowerCase() === targetEmail);
      const studentRecord = matched || {
        _id: `s-${Date.now()}`,
        studentId: `STU${Date.now().toString().slice(-6)}`,
        name: targetEmail ? targetEmail.split('@')[0].toUpperCase() : 'Student User',
        email: targetEmail,
        department: 'Computer Science',
        year: '2026',
        paidAmount: 0,
        pendingAmount: 50000,
        feeStatus: 'Pending',
      };
      const studentUser = { uid: studentRecord._id, name: studentRecord.name, email: studentRecord.email, role: 'student', studentData: studentRecord };
      setUser(studentUser);
      return studentUser;
    }
  };

  const registerStudent = async (data) => {
    const targetEmail = data.email?.toLowerCase()?.trim();
    const targetRoll = data.rollNo?.trim();
    const fatherName = data.fatherName?.trim() || '';

    const isDuplicate = students.some(
      (s) => (s.email && s.email.toLowerCase() === targetEmail) || (targetRoll && s.rollNo === targetRoll)
    );

    if (isDuplicate) {
      throw new Error('A student with this Email or Roll Number is already registered.');
    }

    try {
      const student = await studentApi.create({
        name: data.name,
        fatherName: fatherName,
        email: targetEmail,
        mobile: data.mobile,
        rollNo: targetRoll,
        department: data.dept || data.department,
        year: data.year,
        admissionYear: new Date().getFullYear().toString(),
        password: data.password,
      });
      setStudents((current) => [student, ...current]);
      return student;
    } catch (err) {
      if (err.message && err.message.includes('already registered')) throw err;

      const localStudent = {
        _id: `s${Date.now()}`,
        studentId: `STU${Date.now().toString().slice(-6)}`,
        name: data.name,
        fatherName: fatherName,
        email: targetEmail,
        mobile: data.mobile,
        rollNo: targetRoll,
        department: data.dept || data.department,
        year: data.year,
        admissionYear: new Date().getFullYear().toString(),
        paidAmount: 0,
        pendingAmount: 50000,
        feeStatus: 'Pending',
      };
      setStudents((current) => [localStudent, ...current]);
      return localStudent;
    }
  };

  const updateProfile = async (id, updatedInfo) => {
    const student = await studentApi.update(id, { ...updatedInfo, department: updatedInfo.dept });
    setStudents((current) => current.map((item) => item._id === id ? student : item));
    if (user?.uid === id) setUser((current) => ({ ...current, name: student.name, email: student.email, studentData: student }));
  };

  const recordPayment = async (paymentData) => {
    const student = getRoleStudent(user, students);
    const studentId = paymentData.student || student?._id || user?.uid || 's100';
    const amountNum = Number(paymentData.amount || 0);

    const payload = {
      student: studentId,
      amount: amountNum,
      feeType: paymentData.feeType || 'College Fees',
      method: paymentData.method || 'UPI',
      status: 'Success',
      paidAt: paymentData.paidAt || new Date().toISOString(),
    };

    let newPayment;
    try {
      newPayment = await paymentApi.create(payload);
    } catch (error) {
      console.warn('Payment API fallback to local state:', error);
      newPayment = {
        _id: `txn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        transactionId: `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        student: student || { _id: studentId, name: user?.name || 'Student', email: user?.email },
        amount: payload.amount,
        feeType: payload.feeType,
        method: payload.method,
        status: 'Success',
        paidAt: payload.paidAt,
      };
    }

    // Real-time synchronization: Update payments list instantly in React state
    setPayments((current) => [newPayment, ...current]);

    // Real-time synchronization: Update student balances instantly across all active views
    setStudents((current) =>
      current.map((s) => {
        if (s._id === studentId || s.studentId === studentId || s.email === student?.email) {
          const currentPaid = Number(s.paidAmount || 0);
          const currentPending = Number(s.pendingAmount || 0);
          const newPaid = currentPaid + amountNum;
          const newPending = Math.max(0, currentPending - amountNum);
          return {
            ...s,
            paidAmount: newPaid,
            pendingAmount: newPending,
            feeStatus: newPending === 0 ? 'Paid' : 'Pending',
          };
        }
        return s;
      })
    );

    return newPayment;
  };

  const markNotificationAsRead = (id) => {
    setReadNotificationIds((current) => (current.includes(id) ? current : [...current, id]));
  };

  const resetData = async () => {
    setStudents([]);
    setPayments([]);
    setFees([]);
    setReadNotificationIds([]);
    localStorage.removeItem('edupay_user');
    localStorage.removeItem('edupay_students');
    localStorage.removeItem('edupay_payments');
    localStorage.removeItem('edupay_fees');
    localStorage.removeItem('edupay_responses');
    localStorage.removeItem('edupay_read_notifications');

    try {
      await fetch('/api/students/reset', { method: 'POST' });
    } catch (err) {
      console.warn('Backend reset API call note:', err);
    }
  };

  const activeNotifications = useMemo(
    () => buildNotifications({ user, students, payments, fees }),
    [user, students, payments, fees]
  );

  const filteredNotifications = useMemo(
    () => activeNotifications.filter((item) => !readNotificationIds.includes(item.id)),
    [activeNotifications, readNotificationIds]
  );

  return (
    <AuthContext.Provider value={{
      user, students, payments, fees, notifications: filteredNotifications, loading, apiError,
      login, logout: () => setUser(null), registerStudent, updateProfile,
      recordPayment, markNotificationAsRead, refreshData: loadData, resetData,
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
