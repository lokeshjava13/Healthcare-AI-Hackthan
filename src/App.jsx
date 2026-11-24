import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AIChatAssistant from './components/AIChatAssistant'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext.jsx'
import { useAuth } from './context/useAuth'
import AIAnalysis from './pages/AIAnalysis'
import AdminDoctors from './pages/AdminDoctors'
import BookAppointment from './pages/BookAppointment'
import DoctorDashboard from './pages/DoctorDashboard'
import Doctors from './pages/Doctors'
import DoctorRegister from './pages/DoctorRegister'
import DoctorLogin from './pages/DoctorLogin'
import Home from './pages/Home'
import AIChat from './pages/AIChat'
import Login from './pages/Login'
import PatientRegister from './pages/PatientRegister'
import MyAppointments from './pages/MyAppointments'
import PatientDashboard from './pages/Patientdashboard'
import Reports from './pages/Reports'
import SymptomChecker from './pages/SymptomChecker'

function AppLayout() {
  const { user, logout } = useAuth()
  const [toast, setToast] = useState('')
  const chatScope = user?.patientId || user?.userId || user?.doctorId || 'guest'

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 3000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const bookAppointment = () => (
    <ProtectedRoute roles={['PATIENT']}>
      <BookAppointment
        showToast={setToast}
      />
    </ProtectedRoute>
  )

  return (
    <div className="app-shell">
      <Navbar user={user} onLogout={() => { logout(); setToast('You have been logged out.') }} />
      {toast && <div className="toast-message" role="status">{toast}</div>}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/login" element={<Login showToast={setToast} />} />
          <Route path="/doctor-login" element={<DoctorLogin showToast={setToast} />} />
          <Route path="/register" element={<Navigate to="/register/patient" replace />} />
          <Route path="/register/patient" element={<PatientRegister showToast={setToast} />} />
          <Route path="/register/doctor" element={<DoctorRegister showToast={setToast} />} />
          <Route path="/doctor-register" element={<Navigate to="/register/doctor" replace />} />
          <Route path="/admin/login" element={<Login showToast={setToast} defaultRole="ADMIN" />} />
          <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />
          <Route
            path="/admin/doctors"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminDoctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient"
            element={
              <ProtectedRoute roles={['PATIENT']}>
                <PatientDashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor"
            element={
              <ProtectedRoute roles={['DOCTOR']}>
                <DoctorDashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute roles={['DOCTOR']}>
                <DoctorDashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['PATIENT']}>
                <PatientDashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route path="/doctors" element={<Doctors />} />
          <Route
            path="/reports"
            element={
              <ProtectedRoute roles={['PATIENT']}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-analysis"
            element={
              <ProtectedRoute roles={['PATIENT']}>
                <AIAnalysis />
              </ProtectedRoute>
            }
          />
          <Route path="/book-appointment" element={bookAppointment()} />
          <Route path="/book-appointment/:doctorId" element={bookAppointment()} />
          <Route path="/book" element={bookAppointment()} />
          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute roles={['PATIENT']}>
                <MyAppointments />
              </ProtectedRoute>
            }
          />
          <Route path="/appointments" element={<Navigate to="/my-appointments" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <h3>Healthcare AI</h3>
        <p>© 2026 Healthcare AI. All rights reserved.</p>
      </footer>
      <AIChatAssistant key={chatScope} scope={chatScope} />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  )
}
