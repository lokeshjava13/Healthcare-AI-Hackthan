import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './authContext'
import * as authService from '../services/authService'

function readStoredUser() {
  const token = localStorage.getItem('token')
  if (!token) {
    return null
  }

  const role = localStorage.getItem('role')?.toUpperCase()
  if (role === 'PATIENT') {
    const patientId = localStorage.getItem('patientId')
    const name = localStorage.getItem('patientName')
    const email = localStorage.getItem('patientEmail')
    if (patientId && name && email) {
      return { userId: patientId, patientId, name, email, role }
    }
    return null
  }

  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (user && typeof user === 'object') return user
    return null
  } catch {
    return null
  }
}

function saveAuthResponse(response, setUser, roleHint) {
  const payload = response?.data && typeof response.data === 'object'
    ? response.data
    : response || {}
  if (roleHint === 'PATIENT') {
    console.log('Patient Login Response:', response?.data)
  }
  const token = payload.token || payload.accessToken
  const nestedUser = payload.user && typeof payload.user === 'object'
    ? payload.user
    : {}
  const nestedPatient = payload.patient && typeof payload.patient === 'object'
    ? payload.patient
    : {}
  const nestedDoctor = payload.doctor && typeof payload.doctor === 'object'
    ? payload.doctor
    : {}
  const patientId = payload.patientId
    ?? payload.patient_id
    ?? nestedPatient.id
    ?? nestedUser.patientId
    ?? nestedUser.userId
    ?? nestedUser.id
    ?? payload.id
    ?? payload.userId
  const userId = payload.userId
    ?? payload.id
    ?? nestedUser.userId
    ?? nestedUser.id
    ?? nestedPatient.id
    ?? patientId
  const name = payload.name ?? nestedPatient.name ?? nestedDoctor.name ?? nestedUser.name
  const email = payload.email ?? nestedPatient.email ?? nestedDoctor.email ?? nestedUser.email
  const role = payload.role ?? nestedPatient.role ?? nestedDoctor.role ?? nestedUser.role ?? roleHint
  const doctorId = payload.doctorId ?? payload.doctor_id ?? nestedUser.doctorId ?? nestedUser.id
  if (!token || userId == null || !name || !email || !role) {
    throw new Error('The authentication response is missing token, userId, name, email, or role.')
  }

  const normalizedRole = String(role).trim().toUpperCase()
  const user = {
    userId,
    ...(patientId != null ? { patientId } : {}),
    ...(doctorId != null ? { doctorId } : {}),
    ...(normalizedRole === 'PATIENT' && patientId == null ? { patientId: userId } : {}),
    ...(normalizedRole === 'DOCTOR' && doctorId == null ? { doctorId: userId } : {}),
    name,
    email,
    role: normalizedRole,
  }
  for (const key of [
    'user', 'userId', 'name', 'email',
    'patientId', 'patientName', 'patientEmail',
    'doctorId', 'doctorName', 'doctorEmail',
  ]) {
    localStorage.removeItem(key)
  }
  localStorage.setItem('token', token)
  localStorage.setItem('role', normalizedRole)
  if (normalizedRole === 'PATIENT') {
    localStorage.setItem('patientId', String(patientId ?? userId))
    localStorage.setItem('patientName', name)
    localStorage.setItem('patientEmail', email)
  } else {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('userId', String(userId))
    localStorage.setItem('name', name)
    localStorage.setItem('email', email)
  }
  if (normalizedRole === 'DOCTOR') {
    localStorage.setItem('doctorId', String(doctorId ?? userId))
    localStorage.setItem('doctorName', name)
    localStorage.setItem('doctorEmail', email)
  }
  setUser(user)
  return user
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  const login = useCallback(async (email, password, role = 'PATIENT') => {
    const response = role === 'DOCTOR'
      ? await authService.loginDoctorUser(email, password)
      : role === 'ADMIN'
        ? await authService.loginAdminUser(email, password)
        : await authService.loginPatientUser(email, password)
    return saveAuthResponse(response, setUser, role)
  }, [])

  const logout = useCallback(() => {
    for (const key of [
      'token', 'user', 'userId', 'patientId', 'doctorId',
      'patientName', 'patientEmail', 'doctorName', 'doctorEmail', 'name', 'email', 'role',
    ]) localStorage.removeItem(key)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, login, logout }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

