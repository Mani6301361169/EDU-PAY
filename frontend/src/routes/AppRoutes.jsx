import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import PublicRoute from '../components/PublicRoute/PublicRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// Public pages
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import Contact from '../pages/Contact/Contact';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import NotFound from '../pages/NotFound/NotFound';
import MobileBottomNav from '../components/MobileBottomNav/MobileBottomNav';

// Student pages
import StudentDashboard from '../pages/Student/Dashboard/Dashboard';
import StudentFeeDetails from '../pages/Student/FeeDetails/FeeDetails';
import StudentPayment from '../pages/Student/Payment/Payment';
import StudentReceipts from '../pages/Student/Receipts/Receipts';
import StudentNotifications from '../pages/Student/Notifications/Notifications';
import StudentProfile from '../pages/Student/Profile/Profile';
import StudentSettings from '../pages/Student/Settings/Settings';

// Parent pages
import ParentDashboard from '../pages/Parent/Dashboard/Dashboard';
import ParentStudentDetails from '../pages/Parent/StudentDetails/StudentDetails';
import ParentPayment from '../pages/Parent/Payment/Payment';
import ParentReceipts from '../pages/Parent/Receipts/Receipts';
import ParentProfile from '../pages/Parent/Profile/Profile';

// Accountant pages
import AccountantDashboard from '../pages/Accountant/Dashboard/Dashboard';

// Admin pages
import AdminDashboard from '../pages/Admin/Dashboard/Dashboard';
import AdminStudents from '../pages/Admin/Students/Students';
import AdminFees from '../pages/Admin/Fees/Fees';
import AdminReports from '../pages/Admin/Reports/Reports';
import AdminSettings from '../pages/Admin/Settings/Settings';
import LandingEditor from '../pages/Admin/LandingEditor/LandingEditor';
import PaymentSuccessPage from '../pages/PaymentSuccess/PaymentSuccessPage';

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="fees" element={<StudentFeeDetails />} />
          <Route path="payments" element={<StudentPayment />} />
          <Route path="payments/success" element={<PaymentSuccessPage />} />
          <Route path="receipts" element={<StudentReceipts />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="settings" element={<StudentSettings />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Parent Private Routes */}
        <Route
          path="/parent/*"
          element={
            <ProtectedRoute allowedRoles={['parent']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ParentDashboard />} />
          <Route path="details" element={<ParentStudentDetails />} />
          <Route path="payments" element={<ParentPayment />} />
          <Route path="payments/success" element={<PaymentSuccessPage />} />
          <Route path="receipts" element={<ParentReceipts />} />
          <Route path="profile" element={<ParentProfile />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Accountant Private Routes */}
        <Route
          path="/accountant/*"
          element={
            <ProtectedRoute allowedRoles={['accountant']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AccountantDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Private Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="fees" element={<AdminFees />} />
          <Route path="payments" element={<StudentReceipts />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="landing" element={<LandingEditor />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Fallback 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <MobileBottomNav />
    </>
  );
};

export default AppRoutes;
