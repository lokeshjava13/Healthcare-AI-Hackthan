import { loginAdmin, loginDoctor, loginPatient } from './api'

export const loginPatientUser = (email, password) =>
  loginPatient({ email, password })
export const loginDoctorUser = (email, password) =>
  loginDoctor({ email, password })
export const loginAdminUser = (email, password) =>
  loginAdmin({ email, password })
