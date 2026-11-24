export default function DoctorAvatar({ doctor, size = 'default' }) {
  return (
    <span
      className={`doctor-avatar initial-avatar${size === 'large' ? ' doctor-avatar-large' : ''}`}
      role="img"
      aria-label={`${doctor.name} initials`}
    >
      <span aria-hidden="true">{doctor.initials || 'DR'}</span>
    </span>
  )
}
