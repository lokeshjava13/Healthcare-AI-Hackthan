import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { useAuth } from '../context/useAuth'

const roleRoutes = {
  PATIENT: '/dashboard',
  DOCTOR: '/doctor',
  RECEPTIONIST: '/receptionist',
  ADMIN: '/admin/doctors',
}

export default function Login({ showToast, defaultRole = 'PATIENT' }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState(defaultRole)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const submit = async ({ email, password }) => {
    setError('')
    setFieldErrors({})
    setLoading(true)
    try {
      const user = await login(email, password, role)
      showToast('Welcome back!')
      navigate(roleRoutes[user.role] || '/dashboard', { replace: true })
    } catch (requestError) {
      console.log('Login Error:', requestError.response?.data)
      const data = requestError?.response?.data
      const message = requestError.response?.status === 401
        ? 'Invalid email or password'
        : (typeof data?.message === 'string' && data.message)
          || requestError.message
          || 'Unable to sign in.'
      if (requestError.response?.status === 401) {
        setFieldErrors({ password: message })
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthForm
      mode="login"
      onSubmit={submit}
      error={error}
      fieldErrors={fieldErrors}
      loading={loading}
      roleSelector={defaultRole !== 'PATIENT' ? null : {
        value: role,
        onChange: (nextRole) => {
          setRole(nextRole)
          setError('')
          setFieldErrors({})
        },
      }}
    />
  )
}
