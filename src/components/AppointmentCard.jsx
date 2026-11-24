import Button from './Button'

function displayText(value, fallback) {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : fallback
}

export default function AppointmentCard({ appointment = {}, showActions = false, onConfirm, onCancel }) {
  // TODO: align appointment field names with the backend DTO when Swagger is available.
  const patient = displayText(
    appointment?.patient?.name || appointment?.patientName || appointment?.patient || appointment?.name,
    'Patient',
  )
  const doctor = displayText(
    appointment?.doctor?.name || appointment?.doctorName || appointment?.doctor,
    'Doctor',
  )
  const specialty = displayText(appointment?.specialization || appointment?.specialty, '')
  const date = displayText(
    appointment?.date || appointment?.appointmentDate || appointment?.scheduledAt,
    'Date unavailable',
  )
  const time = displayText(appointment?.time || appointment?.appointmentTime, 'Time unavailable')
  const status = displayText(appointment?.status, 'Status unavailable')
  const normalizedStatus = status.toUpperCase()
  const statusClass = {
    PENDING: 'status-pending',
    ACCEPTED: 'status-confirmed',
    REJECTED: 'status-cancelled',
    COMPLETED: 'status-completed',
  }[normalizedStatus] || 'status-pending'
  const statusLabel = {
    PENDING: 'Awaiting',
    ACCEPTED: 'Confirmed',
    REJECTED: 'Rejected',
  }[normalizedStatus] || status

  return (
    <article className="appointment-card">
      <div className="appointment-details">
        <strong>{patient}</strong>
        <span>{doctor}{specialty ? ` · ${specialty}` : ''}</span>
        <span>{date} · {time}</span>
      </div>
      {showActions ? (
        <div className="appointment-actions">
          <Button variant="success" onClick={onConfirm}>Confirm</Button>
          <Button variant="danger" onClick={onCancel}>Cancel</Button>
        </div>
      ) : (
        <span className={`status-badge ${statusClass}`}>
          {statusLabel}
        </span>
      )}
    </article>
  )
}
