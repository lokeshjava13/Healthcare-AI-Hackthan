import axios from 'axios'

const configuredBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:1234/api'
export const baseURL = configuredBaseURL.replace(/\/+$/, '').replace(/\/api$/, '') + '/api'

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseData = error.response?.data
    if (error.response?.status === 401) {
      for (const key of [
        'token', 'user', 'userId', 'patientId', 'doctorId',
        'patientName', 'patientEmail', 'doctorName', 'doctorEmail', 'role',
      ]) {
        localStorage.removeItem(key)
      }
    }
    if (error.code === 'ERR_NETWORK') {
      error.message = 'Backend not running on localhost:1234. Start DocAiApplication.java'
    } else if (typeof responseData === 'string' && responseData.trim()) {
      error.message = responseData.trim()
    } else if (typeof responseData?.message === 'string' && responseData.message.trim()) {
      error.message = responseData.message.trim()
    } else if (typeof responseData?.error === 'string' && responseData.error.trim()) {
      error.message = responseData.error.trim()
    }
    return Promise.reject(error)
  },
)

api.upload = (path, formData) =>
  api.post(path, formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const registerPatient = (data) => api.post('/auth/register/patient', data)
export const loginPatient = (data) => api.post('/patients/login', data)
export const registerDoctor = (data) => api.post('/auth/register/doctor', data)
export const loginDoctor = (data) => api.post('/doctors/login', data)
export const loginAdmin = (data) => api.post('/auth/admin/login', data)
export const getDoctors = () => api.get('/doctors/')
export const getDoctorById = (id) => api.get(`/doctors/${encodeURIComponent(id)}`)
export const bookAppointment = (data) => api.post('/appointments/book', data)
export const getPatientAppointments = (patientId) =>
  api.get(`/appointments/patient/${encodeURIComponent(patientId)}`)
export const getPatientReports = (patientId) =>
  api.get(`/reports/patient/${encodeURIComponent(patientId)}`)
export const uploadPatientReport = (patientId, file) => {
  const formData = new FormData()
  formData.append('patientId', patientId)
  formData.append('file', file)
  return api.upload('/reports/upload', formData)
}
export const getDoctorAppointments = (doctorId) =>
  api.get(`/appointments/doctor/${encodeURIComponent(doctorId)}`)
export const updateAppointmentStatus = (id, status) =>
  api.put(`/appointments/${encodeURIComponent(id)}/status`, { status })
export const acceptAppointment = (id) =>
  api.put(`/appointments/${encodeURIComponent(id)}/accept`)
export const rejectAppointment = (id) =>
  api.put(`/appointments/${encodeURIComponent(id)}/reject`)
export const getPendingDoctors = () => api.get('/admin/doctors/pending')
export const approveDoctor = (id, data) =>
  api.put(`/admin/doctors/${encodeURIComponent(id)}/approve`, data)
export const rejectDoctor = (id) =>
  api.put(`/admin/doctors/${encodeURIComponent(id)}/reject`)

export function isBackendUnavailable(error) {
  return error?.code === 'ERR_NETWORK'
    || error?.response?.status === 404
    || (typeof error?.response?.status === 'number' && error.response.status >= 500)
}
