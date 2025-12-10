import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { lazy, Suspense } from 'react'

import logo from './assets/logo.png'

const Login = lazy(() => import('./features/auth/pages/Login'));
const AdminSidebar = lazy(() => import('./features/dashboard/sidebar/AdminSidebar'));
const AdminDashboard = lazy(() => import('./features/dashboard/pages/Dashboard'));
const ViewStudents = lazy(() => import('./features/student-management/pages/viewStudents'));
const AddStudent = lazy(() => import('./features/student-management/pages/addStudent'));
const ManageStaff = lazy(() => import('./features/staff-management/pages/manageStaff'));
const FeeManagement = lazy(() => import('./features/fianance-management/pages/feeManagement'));
const SalaryManagement = lazy(() => import('./features/fianance-management/pages/salaryManagement'));
const ExpenseManagement = lazy(() => import('./features/fianance-management/pages/expenseManagement'))
const EmployeeAttendance = lazy(() => import('./features/attendance/employee-attendance'));
const EmployeeAttendanceReport = lazy(() => import('./features/attendance/employee-attendance-report'));

function App() {

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Suspense fallback={<div className='text-center h-screen flex items-center justify-center text-black'>
          <img src={logo} alt="" className='animate-spin h-20 w-20' />
          <h1 className='text-xs font-bold'>ilamPannel</h1>

        </div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminSidebar />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students/view" element={<ViewStudents />} />
              <Route path="students/add" element={<AddStudent />} />
              <Route path="staff/manage-staff" element={<ManageStaff />} />
              <Route path="financial/fee-management" element={<FeeManagement />} />
              <Route path="financial/salary-management" element={<SalaryManagement />} />
              <Route path='financial/expense-management' element={<ExpenseManagement />} />
              <Route path="attendance/employee" element={<EmployeeAttendance />} />
              <Route path="attendance/employee-report" element={<EmployeeAttendanceReport />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  )
}

export default App
