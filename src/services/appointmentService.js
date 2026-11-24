import {
  api,
  acceptAppointment,
  bookAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  rejectAppointment,
  updateAppointmentStatus,
} from './api'

export {
  acceptAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  rejectAppointment,
  updateAppointmentStatus,
}
export const getAppointmentById = (id) =>
  api.get(`/appointments/${encodeURIComponent(id)}`)
export const createAppointment = bookAppointment
export const updateAppointment = (id, data) =>
  api.put(`/appointments/${encodeURIComponent(id)}`, data)
export const deleteAppointment = (id) =>
  api.delete(`/appointments/${encodeURIComponent(id)}`)
