import { api } from './api'

export const getPatients = () => api.get('/patients')
export const getPatientById = (id) => api.get(`/patients/${encodeURIComponent(id)}`)
export const createPatient = (data) => api.post('/patients', data)
export const updatePatient = (id, data) =>
  api.put(`/patients/${encodeURIComponent(id)}`, data)
