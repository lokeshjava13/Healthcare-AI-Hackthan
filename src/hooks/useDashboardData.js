import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPatientAppointments } from '../services/appointmentService'
import { getPatientReports } from '../services/reportService'
import { unwrapCollection } from '../utils/collections'

export default function useDashboardData() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    const patientId = localStorage.getItem('patientId')
    if (!localStorage.getItem('token') || !patientId) {
      navigate('/login', { replace: true })
      return () => {
        active = false
      }
    }

    const loadData = async () => {
      setLoading(true)
      setError('')
      try {
        const [appointmentResponse, reportResponse] = await Promise.all([
          getPatientAppointments(patientId),
          getPatientReports(patientId),
        ])
        const appointmentRecords = unwrapCollection(appointmentResponse)
        const reportRecords = unwrapCollection(reportResponse)
        if (!appointmentRecords || !reportRecords) {
          throw new Error('Unexpected response from the patient dashboard endpoints.')
        }
        if (!active) return
        setAppointments(appointmentRecords)
        setReports(reportRecords)
      } catch (requestError) {
        if (!active) return
        setAppointments([])
        setReports([])
        setError(requestError.response?.data?.message || requestError.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadData()
    return () => {
      active = false
    }
  }, [navigate, reloadKey])

  const retry = () => {
    setLoading(true)
    setError('')
    setReloadKey((key) => key + 1)
  }

  return { appointments, reports, loading, error, retry }
}
