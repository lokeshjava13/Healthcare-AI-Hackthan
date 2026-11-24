import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import StatCard from '../components/StatCard'
import DashboardLayout from '../layouts/DashboardLayout'
import {
  acceptAppointment,
  getDoctorAppointments,
  rejectAppointment,
} from '../services/appointmentService'
import { unwrapCollection } from '../utils/collections'

const statusClasses = {
  PENDING: 'status-pending',
  ACCEPTED: 'status-confirmed',
  REJECTED: 'status-cancelled',
  COMPLETED: 'status-completed',
}

export default function DoctorDashboard({ user }) {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    const loadAppointments = async () => {
      setLoading(true)
      setError('')
      try {
        const doctorId = localStorage.getItem('doctorId')
        if (!doctorId) {
          navigate('/doctor-login', { replace: true })
          return
        }
        const response = await getDoctorAppointments(doctorId)
        const records = unwrapCollection(response)
        if (!records) throw new Error('Unexpected response from the doctor appointments endpoint.')
        if (active) setAppointments(records)
      } catch (requestError) {
        if (active) {
          setAppointments([])
          setError(
            requestError.response?.data?.message
              || requestError.message
              || 'Unable to load appointments.',
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    loadAppointments()
    return () => {
      active = false
    }
  }, [navigate, reloadKey])

  const changeStatus = async (appointmentId, status) => {
    setUpdatingId(appointmentId)
    setError('')
    try {
      if (status === 'ACCEPTED') {
        await acceptAppointment(appointmentId)
      } else {
        await rejectAppointment(appointmentId)
      }
      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === appointmentId ? { ...appointment, status } : appointment,
        ),
      )
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
          || requestError.message
          || 'Unable to update appointment status.',
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const formatDate = (value) =>
    value ? new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString() : 'Date unavailable'
  const formatTime = (value) => value ? String(value).slice(0, 5) : 'Time unavailable'

  const pendingCount = appointments.filter(
    (appointment) => String(appointment.status).toUpperCase() === 'PENDING',
  ).length
  const bookedCount = appointments.filter((appointment) =>
    ['ACCEPTED', 'PENDING'].includes(String(appointment.status).toUpperCase()),
  ).length

  return (
    <DashboardLayout
      role="Doctor"
      title={`Welcome, ${user.name}`}
      description="Manage your patient appointments."
    >
      <div className="stat-grid" id="appointments">
        <StatCard title="Appointments" value={appointments.length} subtitle="Your schedule" icon="📅" />
        <StatCard title="Booked" value={bookedCount} subtitle={`${pendingCount} awaiting confirmation`} icon="🛡️" />
      </div>

      {error && (
        <div className="api-error-state" role="alert">
          <p>{error}</p>
          <Button variant="outline" onClick={() => setReloadKey((key) => key + 1)}>Retry</Button>
        </div>
      )}

      <section className="panel dashboard-panel" id="patients">
        <div className="panel-heading">
          <div><h2>Patient appointments</h2><p>Review visits and update their status.</p></div>
        </div>
        {loading ? (
          <div className="loading-label" role="status"><span className="loading-spinner" aria-hidden="true" />Loading appointments</div>
        ) : appointments.length ? (
          <div className="appointment-list">
            {appointments.map((appointment) => {
              const status = String(appointment.status || 'PENDING').toUpperCase()
              const patientName = appointment.patientName
                || appointment.patient?.name
                || appointment.patient_name
                || `Patient ${appointment.patient_id ?? appointment.patientId ?? ''}`
              return (
                <article className="appointment-card" key={appointment.id}>
                  <div className="appointment-details">
                    <strong>{patientName}</strong>
                    <span>{formatDate(appointment.appointment_date || appointment.appointmentDate)} · {formatTime(appointment.appointment_time || appointment.appointmentTime)}</span>
                    <span>{appointment.reason || 'No reason provided'}</span>
                  </div>
                  <span className={`status-badge ${statusClasses[status] || 'status-completed'}`}>
                    {status}
                  </span>
                  {status === 'PENDING' && (
                    <div className="appointment-actions">
                      <Button
                        disabled={updatingId === appointment.id}
                        onClick={() => changeStatus(appointment.id, 'ACCEPTED')}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        disabled={updatingId === appointment.id}
                        onClick={() => changeStatus(appointment.id, 'REJECTED')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">
            <span aria-hidden="true">📅</span>
            <p>No patient appointments found.</p>
          </div>
        )}
      </section>
    </DashboardLayout>
  )
}
