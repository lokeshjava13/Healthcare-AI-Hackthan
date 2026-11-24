import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppointmentCard from '../components/AppointmentCard'
import Button from '../components/Button'
import StatCard from '../components/StatCard'
import DashboardLayout from '../layouts/DashboardLayout'
import useDashboardData from '../hooks/useDashboardData'

export default function PatientDashboard({ user }) {
  const { appointments, reports, loading, error, retry } = useDashboardData()
  const patientId = localStorage.getItem('patientId')
  const patientName = localStorage.getItem('patientName') || user.name
  const [analysisHistoryState] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(`healthcare-ai-report-analysis:${patientId}`) || '[]',
      )
      if (!Array.isArray(saved)) throw new Error('Saved analysis history has an unexpected format.')
      return { history: saved.slice(0, 3), error: '' }
    } catch (historyError) {
      return { history: [], error: historyError.message }
    }
  })
  const { history: analysisHistory, error: analysisHistoryError } = analysisHistoryState

  return (
    <DashboardLayout
      role="Patient"
      title={`Hello, ${patientName}`}
      description="Your personal care overview."
    >
      <div className="stat-grid">
        <StatCard title="My Appointments" value={appointments.length} icon="📅" />
        <StatCard title="My Reports" value={reports.length} subtitle="Available reports" icon="🛡️" />
      </div>

      {error && (
        <div className="api-error-state" role="alert">
          <p>{error}</p>
          <Button variant="outline" onClick={retry}>Retry</Button>
        </div>
      )}
      <section className="panel dashboard-panel">
        <div className="panel-heading">
          <div><h2>Upcoming appointments</h2><p>Your appointments and current status.</p></div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link className="button button-outline" to="/my-appointments">My appointments</Link>
            <Link className="button button-primary" to="/book-appointment">Book a visit</Link>
          </div>
        </div>
        {loading ? (
          <div className="loading-label" role="status"><span className="loading-spinner" aria-hidden="true" />Loading dashboard</div>
        ) : error ? null : appointments.length ? (
          <div className="appointment-list">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={{
                  ...appointment,
                  patient: patientName,
                  doctorName: appointment.doctorName || appointment.doctor?.name || 'Doctor',
                  date: appointment.appointmentDate || appointment.appointment_date,
                  time: appointment.appointmentTime || appointment.appointment_time,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span aria-hidden="true">📅</span>
            <p>No appointments yet. Book a visit to get started.</p>
            <Link className="button button-primary" to="/book-appointment">Book a visit</Link>
          </div>
        )}
      </section>

      <section className="panel care-note">
        <div>
          <span className="eyebrow">HEALTHCARE AI</span>
          <h2>Need help deciding what to do next?</h2>
          <p>This demo does not provide medical advice. For health concerns, contact a qualified healthcare professional.</p>
        </div>
        <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Back to top
        </Button>
      </section>

      <section className="panel dashboard-panel ai-history-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent AI report analyses</h2>
            <p>Demo summaries saved locally in this browser.</p>
          </div>
          <Link className="button button-outline" to="/reports">View reports</Link>
        </div>
        {analysisHistoryError ? (
          <p className="form-error" role="alert">{analysisHistoryError}</p>
        ) : analysisHistory.length ? (
          <ul className="ai-history-list">
            {analysisHistory.map((item) => (
              <li key={`${item.reportId}-${item.analyzedAt}`}>
                <div>
                  <strong>{item.reportName || 'Medical report'}</strong>
                  <span>{item.result?.summary || 'Analysis saved'}</span>
                </div>
                <span className={`risk-badge risk-${String(item.result?.riskLevel || 'low').toLowerCase()}`}>
                  Demo risk: {item.result?.riskLevel || 'Low'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state ai-history-empty">
            <p>No AI report analyses yet.</p>
            <Link className="text-link" to="/reports">Upload or analyze a report <span aria-hidden="true">→</span></Link>
          </div>
        )}
      </section>
    </DashboardLayout>
  )
}
