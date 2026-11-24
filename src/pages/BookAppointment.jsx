import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import InputField from '../components/InputField'
import { getDoctors } from '../services/api'
import { createAppointment } from '../services/appointmentService'
import { toDoctorViewModel } from '../utils/doctors'

const dates = [
  { value: '2026-11-24', label: 'Nov 24, 2026' },
  { value: '2026-11-25', label: 'Nov 25, 2026' },
  { value: '2026-11-26', label: 'Nov 26, 2026' },
]
const slots = [
  { value: '10:00', label: '10:00 AM' },
  { value: '11:30', label: '11:30 AM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '16:00', label: '4:00 PM' },
]

export default function BookAppointment({ showToast }) {
  const navigate = useNavigate()
  const { doctorId: requestedDoctor } = useParams()
  const [doctors, setDoctors] = useState([])
  const [doctorsLoading, setDoctorsLoading] = useState(true)
  const [doctorsError, setDoctorsError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [doctorId, setDoctorId] = useState(requestedDoctor || '')
  const [date, setDate] = useState(dates[0].value)
  const [time, setTime] = useState(slots[0].value)
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login', { replace: true })
      return undefined
    }

    let active = true
    const loadDoctors = async () => {
      setDoctorsLoading(true)
      setDoctorsError('')
      try {
        const response = await getDoctors()
        console.log('Book Appointment doctors response:', response.data)
        const records = Array.isArray(response.data)
          ? response.data
          : response.data?.data
        if (!Array.isArray(records)) {
          throw new Error('Unexpected response from /api/doctors/.')
        }
        if (active) setDoctors(records.map(toDoctorViewModel))
      } catch (requestError) {
        console.log(
          'Book Appointment Error:',
          requestError.response?.data,
          requestError.response?.status,
          requestError.message,
        )
        if (active) {
          setDoctors([])
          setDoctorsError(
            requestError.response?.data?.message
              || requestError.message
              || 'Backend not reachable on localhost:1234',
          )
        }
      } finally {
        if (active) setDoctorsLoading(false)
      }
    }
    loadDoctors()
    return () => {
      active = false
    }
  }, [navigate, reloadKey])

  const retry = () => setReloadKey((key) => key + 1)

  const selectedDoctor = doctors.find((doctor) => String(doctor.id) === doctorId)
    || doctors.find((doctor) => String(doctor.id) === requestedDoctor)
    || doctors[0]
  const selectedDoctorId = selectedDoctor?.id == null ? '' : String(selectedDoctor.id)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (!localStorage.getItem('token')) {
      navigate('/login', { replace: true })
      return
    }
    if (!selectedDoctor || selectedDoctor.id == null) {
      setError('Select a doctor with an available ID.')
      return
    }
    const storedPatientId = localStorage.getItem('patientId')
    if (!storedPatientId || !Number.isSafeInteger(Number(storedPatientId))) {
      setError('A valid patient ID is required to book this appointment.')
      return
    }
    const payload = {
      patientId: Number(storedPatientId),
      doctorId: Number(selectedDoctor.id),
      appointment_date: date,
      appointment_time: time.length === 5 ? `${time}:00` : time,
      reason: reason.trim(),
    }

    setCreating(true)
    try {
      await createAppointment(payload)
      showToast('Appointment booked!')
      navigate('/my-appointments', { replace: true })
    } catch (requestError) {
      console.log(
        'Book Appointment Error:',
        requestError.response?.data,
        requestError.response?.status,
        requestError.message,
      )
      setError(
        requestError.response?.data?.message
          || requestError.message
          || 'Backend not reachable on localhost:1234',
      )
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="page-container booking-page">
      <header className="page-heading standalone-heading">
        <div>
          <span className="eyebrow">PLAN YOUR VISIT</span>
          <h1>Book an appointment</h1>
          <p>Choose a doctor and a time for your visit.</p>
        </div>
      </header>
      <div className="booking-layout">
        <form className="panel booking-form" onSubmit={submit}>
          <h2>Appointment details</h2>
          {doctorsLoading ? (
            <div className="loading-label" role="status"><span className="loading-spinner" aria-hidden="true" />Loading doctors...</div>
          ) : doctorsError ? (
            <div className="api-error-state" role="alert">
              <p>{doctorsError}</p>
              <p>Check if backend is running on localhost:1234 - Run DocAiApplication.java</p>
              <Button variant="outline" type="button" onClick={retry}>Retry</Button>
            </div>
          ) : doctors.length ? (
            <>
              <div className="input-field">
                <label htmlFor="doctor-select">Doctor</label>
                <select
                  id="doctor-select"
                  className="text-input"
                  value={selectedDoctorId}
                  onChange={(event) => setDoctorId(event.target.value)}
                  required
                >
                  {doctors.map((doctor, index) => (
                    <option key={doctor.id ?? index} value={doctor.id ?? ''}>
                      {doctor.name} · {doctor.specialization} · ₹{doctor.consultationFee}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-field">
                <label htmlFor="appointment-date">Date</label>
                <select id="appointment-date" className="text-input" value={date} onChange={(event) => setDate(event.target.value)}>
                  {dates.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>
              <div className="input-field">
                <label htmlFor="appointment-time">Available time</label>
                <select id="appointment-time" className="text-input" value={time} onChange={(event) => setTime(event.target.value)}>
                  {slots.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>
              <InputField
                label="Reason"
                name="reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Reason for the visit"
              />
              {error && <p className="form-error" role="alert">{error}</p>}
              <Button type="submit" full disabled={creating || doctorsLoading || !selectedDoctor}>
                {creating ? 'Booking...' : 'Confirm appointment'}
              </Button>
            </>
          ) : (
            <div className="empty-state doctor-empty">
              <span aria-hidden="true">🩺</span>
              <h2>No doctors found</h2>
              <p>There are no doctors available to book right now.</p>
            </div>
          )}
        </form>

        {selectedDoctor && (
          <aside className="panel booking-summary">
            <span className="doctor-avatar" style={{ backgroundColor: selectedDoctor.color }}>
              {selectedDoctor.initials}
            </span>
            <span className="eyebrow">SELECTED PROVIDER</span>
            <h2>{selectedDoctor.name}</h2>
            <p>{selectedDoctor.specialization}</p>
            <p>🎓 {selectedDoctor.qualification}</p>
            <div className="summary-rule" />
            <div className="summary-fee">
              <span>Consultation fee</span>
              <strong>₹{selectedDoctor.consultationFee}</strong>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
