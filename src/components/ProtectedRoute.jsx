import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const roleRoutes = {
  PATIENT: '/dashboard',
  DOCTOR: '/doctor',
  RECEPTIONIST: '/receptionist',
  ADMIN: '/admin/doctors',
}

export default function ProtectedRoute({
  children,
  roles,
  unauthorizedTo,
}) {
  const { user } = useAuth()
  const location = useLocation()

  if (!localStorage.getItem('token') || !user) {
    return <Navigate
      to={roles?.includes('ADMIN') ? '/admin/login' : '/login'}
      replace
      state={{ from: location }}
    />
  }

  if (
    user.role === 'PATIENT'
    && ['/doctor', '/doctor-dashboard'].includes(location.pathname)
  ) {
    return <Navigate to="/dashboard" replace />
  }

  if (
    user.role === 'DOCTOR'
    && ['/my-appointments', '/reports', '/ai-analysis'].includes(location.pathname)
  ) {
    return <Navigate to="/doctor" replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={unauthorizedTo || roleRoutes[user.role] || '/'} replace />
  }

  return children
}
