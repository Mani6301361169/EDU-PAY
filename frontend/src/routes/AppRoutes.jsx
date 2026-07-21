import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// Public pages
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import NotFound from '../pages/NotFound/NotFound';

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

// Admin pages
import AdminDashboard from '../pages/Admin/Dashboard/Dashboard';
import AdminStudents from '../pages/Admin/Students/Students';
import AdminFees from '../pages/Admin/Fees/Fees';
import AdminReports from '../pages/Admin/Reports/Reports';
import AdminSettings from '../pages/Admin/Settings/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Private Routes */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout>
              <Routes>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="fees" element={<StudentFeeDetails />} />
                <Route path="payments" element={<StudentPayment />} />
                <Route path="receipts" element={<StudentReceipts />} />
                <Route path="notifications" element={<StudentNotifications />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="settings" element={<StudentSettings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Parent Private Routes */}
      <Route
        path="/parent/*"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <DashboardLayout>
              <Routes>
                <Route path="dashboard" element={<ParentDashboard />} />
                <Route path="details" element={<ParentStudentDetails />} />
                <Route path="payments" element={<ParentPayment />} />
                <Route path="receipts" element={<ParentReceipts />} />
                <Route path="profile" element={<ParentProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Private Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="fees" element={<AdminFees />} />
                <Route path="payments" element={<StudentReceipts />} /> {/* Admin can view/manage receipts history list */}
                <Route path="reports" element={<AdminReports />} />
                <Route path="notifications" element={<StudentNotifications />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
