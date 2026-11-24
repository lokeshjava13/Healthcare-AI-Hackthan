import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { deleteAppointment, getPatientAppointments } from '../services/appointmentService'
import { unwrapCollection } from '../utils/collections'

const statusClasses = {
  PENDING: 'status-pending',
  ACCEPTED: 'status-confirmed',
  REJECTED: 'status-cancelled',
  COMPLETED: 'status-completed',
}
const statusLabels = {
  PENDING: 'Awaiting',
  ACCEPTED: 'Confirmed',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
}

function formatDate(value) {
  if (!value) return 'Date unavailable'
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatTime(value) {
  if (!value) return 'Time unavailable'
  const [hours, minutes] = String(value).split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return String(value)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

export default function MyAppointments() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [cancellingId, setCancellingId] = useState(null)

  const cancelAppointment = async (appointmentId) => {
    setCancellingId(appointmentId)
    setError('')
    try {
      await deleteAppointment(appointmentId)
      setAppointments((current) =>
        current.filter((appointment) => appointment.id !== appointmentId),
      )
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message)
    } finally {
      setCancellingId(null)
    }
  }

  useEffect(() => {
    let active = true
    const patientId = localStorage.getItem('patientId')
    if (!localStorage.getItem('token') || !patientId) {
      navigate('/login', { replace: true })
      return () => {
        active = false
      }
    }

    const loadAppointments = async () => {
      setLoading(true)
      setError('')
      try {
        const appointmentResponse = await getPatientAppointments(patientId)
        const records = unwrapCollection(appointmentResponse)
        if (!records) {
          throw new Error('Unexpected response from the patient appointments endpoint.')
        }

        if (!active) return
        setAppointments(records.map((appointment) => ({
          ...appointment,
          doctorName: appointment.doctorName
            || appointment.doctor_name
            || appointment.doctor?.name
            || 'Doctor',
        })))
      } catch (requestError) {
        if (!active) return
        setAppointments([])
        setError(requestError.response?.data?.message || requestError.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadAppointments()
    return () => {
      active = false
    }
  }, [navigate, reloadKey])

  return (
    <div className="page-container">
      <header className="page-heading standalone-heading">
        <div>
          <span className="eyebrow">YOUR CARE</span>
          <h1>My appointments</h1>
          <p>View and track your upcoming visits.</p>
        </div>
        <Link className="button button-primary" to="/book-appointment">Book Appointment</Link>
      </header>

      {loading ? (
        <div className="loading-label" role="status" aria-live="polite">
          <span className="loading-spinner" aria-hidden="true" />Loading appointments
        </div>
      ) : error ? (
        <div className="panel api-error-state" role="alert">
          <p>{error}</p>
          <Button variant="outline" onClick={() => setReloadKey((key) => key + 1)}>Retry</Button>
        </div>
      ) : appointments.length ? (
        <section className="appointment-list" aria-label="Appointments">
          {appointments.map((appointment) => {
            const status = String(appointment.status || '').toUpperCase()
            return (
              <article className="appointment-card" key={appointment.id}>
                <div className="appointment-details">
                  <strong>{appointment.doctorName}</strong>
                  <span>{formatDate(appointment.appointment_date || appointment.appointmentDate)} · {formatTime(appointment.appointment_time || appointment.appointmentTime)}</span>
                  <span>{appointment.reason || 'No reason provided'}</span>
                </div>
                <span className={`status-badge ${statusClasses[status] || 'status-completed'}`}>
                  {statusLabels[status] || status || 'UNKNOWN'}
                </span>
                {status !== 'REJECTED' && status !== 'COMPLETED' && (
                  <Button
                    variant="danger"
                    onClick={() => cancelAppointment(appointment.id)}
                    disabled={cancellingId === appointment.id}
                  >
                    {cancellingId === appointment.id ? 'Cancelling...' : 'Cancel'}
                  </Button>
                )}
              </article>
            )
          })}
        </section>
      ) : (
        <div className="panel empty-state">
          <span aria-hidden="true">📅</span>
          <h2>No appointments yet</h2>
          <p>Book an appointment to get started.</p>
          <Link className="button button-primary" to="/book-appointment">Book a visit</Link>
        </div>
      )}
    </div>
  )
}
