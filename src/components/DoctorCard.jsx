import { Link } from 'react-router-dom'
import DoctorAvatar from './DoctorAvatar'
import { getDisplayQualification } from '../utils/doctors'

export default function DoctorCard({ doctor }) {
  const experience = Number(doctor.experience)
  const experienceLabel = Number.isFinite(experience)
    ? `${experience} Years Exp`
    : 'Experience N/A'
  const fee = Number(doctor.consultationFee)
  const feeLabel = Number.isFinite(fee) ? `₹${fee}` : 'Fee N/A'
  const qualification = getDisplayQualification(doctor.qualification)

  return (
    <article className="doctor-card demo-doctor-card">
      <div className="demo-doctor-heading">
        <DoctorAvatar doctor={doctor} />
        <div className="demo-doctor-identity">
          <h3>{doctor.name}</h3>
          <span className="doctor-specialty-badge">{doctor.specialization}</span>
        </div>
      </div>
      <div className="demo-doctor-meta" aria-label="Doctor rating, experience, and fee">
        <span className="demo-doctor-rating"><span className="rating-star">★</span> 4.8</span>
        <span>{experienceLabel}</span>
        <strong>{feeLabel}</strong>
      </div>
      {qualification && <p className="demo-doctor-qualification">{qualification}</p>}
      <p className="demo-doctor-availability">
        <span aria-hidden="true" />
        Available Today
      </p>
      {doctor.id != null ? (
        <Link
          className="button button-primary demo-doctor-book"
          to={`/book-appointment/${encodeURIComponent(doctor.id)}`}
        >
          Book Appointment
        </Link>
      ) : (
        <Link className="button button-primary demo-doctor-book" to="/doctors">
          Find Doctor
        </Link>
      )}
    </article>
  )
}
