import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '../components/Button'
import DoctorCard from '../components/DoctorCard'
import InputField from '../components/InputField'
import useDoctors from '../hooks/useDoctors'

export default function Doctors() {
  const { doctors, loading, error, retry } = useDoctors()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(
    () => searchParams.get('specialist') || searchParams.get('search') || '',
  )
  const [specialty, setSpecialty] = useState('All specialties')
  const specialties = ['All specialties', ...new Set(doctors.map((doctor) => doctor.specialization))]
  const visibleDoctors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return doctors.filter((doctor) => {
      const matchesSpecialty = specialty === 'All specialties' || doctor.specialization === specialty
      const searchContent = [
        doctor.name,
        doctor.specialization,
        doctor.qualification,
        doctor.email,
      ].filter(Boolean).join(' ').toLowerCase()
      return matchesSpecialty && (!normalizedQuery || searchContent.includes(normalizedQuery))
    })
  }, [doctors, query, specialty])

  return (
    <div className="page-container">
      <header className="page-heading standalone-heading">
        <div>
          <span className="eyebrow">CARE TEAM</span>
          <h1>Find a doctor</h1>
          <p>Explore doctors and their consultation details.</p>
        </div>
      </header>
      <section className="panel doctor-filters" aria-label="Filter doctors">
        <InputField
          label="Search doctors"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name, specialty, or qualification"
        />
        <div className="input-field">
          <label htmlFor="specialty-filter">Specialty</label>
          <select
            id="specialty-filter"
            className="text-input"
            value={specialty}
            onChange={(event) => setSpecialty(event.target.value)}
          >
            {specialties.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </section>
      {loading ? (
        <div className="doctor-loading" role="status" aria-live="polite">
          <div className="loading-label"><span className="loading-spinner" aria-hidden="true" />Loading doctors</div>
          <div className="doctor-grid doctor-directory skeleton-grid" aria-hidden="true">
            {Array.from({ length: 3 }, (_, index) => (
              <article className="doctor-card skeleton-card" key={index}>
                <span className="skeleton skeleton-avatar" />
                <span className="skeleton skeleton-title" />
                <span className="skeleton skeleton-line" />
                <span className="skeleton skeleton-line short" />
                <span className="skeleton skeleton-button" />
              </article>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="panel api-error-state" role="alert">
          <p>{error}</p>
          <Button variant="outline" onClick={retry}>Retry</Button>
        </div>
      ) : visibleDoctors.length ? (
        <div className="doctor-grid doctor-directory demo-doctor-grid">
          {visibleDoctors.map((doctor, index) => (
            <DoctorCard doctor={doctor} key={doctor.id ?? `${doctor.name}-${index}`} />
          ))}
        </div>
      ) : (
        <div className="panel empty-state doctor-empty">
          <span aria-hidden="true">🩺</span>
          <h2>No doctors found</h2>
          <p>No doctors found. Check backend /api/doctors/ or try another search.</p>
        </div>
      )}
      <p className="demo-notice page-demo-notice">Doctor details are provided by the connected service.</p>
    </div>
  )
}
