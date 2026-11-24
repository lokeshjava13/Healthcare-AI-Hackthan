import { getPatientReports, uploadPatientReport } from './api'

export { getPatientReports }
export const uploadReport = (patientId, file) => uploadPatientReport(patientId, file)
