import { useEffect, useState } from 'react'
import Button from '../components/Button'
import InputField from '../components/InputField'
import { approveDoctor, getPendingDoctors, rejectDoctor } from '../services/api'
import { unwrapCollection } from '../utils/collections'

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([])
  const [licenseNumbers, setLicenseNumbers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const refresh = () => {
    setError('')
    setLoading(true)
    setReloadKey((key) => key + 1)
  }

  useEffect(() => {
    let active = true
    const loadPendingDoctors = async () => {
      try {
        const response = await getPendingDoctors()
        const records = unwrapCollection(response)
        if (!records) throw new Error('Unexpected response from the pending doctors endpoint.')
        if (!active) return
        setError('')
        setDoctors(records)
        setLicenseNumbers((current) => Object.fromEntries(
          records.map((doctor) => [
            doctor.id,
            current[doctor.id] ?? doctor.licenseNumber ?? '',
          ]),
        ))
      } catch (requestError) {
        if (active) {
          setError(
            requestError.response?.data?.message
              || requestError.message
              || 'Unable to load pending doctors.',
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    loadPendingDoctors()
    return () => { active = false }
  }, [reloadKey])

  const approve = async (doctor) => {
    const licenseNumber = (licenseNumbers[doctor.id] || '').trim()
    if (!licenseNumber || licenseNumber.startsWith('LEGACY-UNVERIFIED-')) {
      setError('Enter and verify a valid license number before approving this doctor.')
      return
    }
    setUpdatingId(doctor.id)
    setError('')
    setNotice('')
    try {
      await approveDoctor(doctor.id, { licenseNumber })
      setDoctors((current) => current.filter((entry) => entry.id !== doctor.id))
      setNotice(`${doctor.name} was approved.`)
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
          || requestError.message
          || 'Unable to approve doctor.',
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const reject = async (doctor) => {
    setUpdatingId(doctor.id)
    setError('')
    setNotice('')
    try {
      await rejectDoctor(doctor.id)
      setDoctors((current) => current.filter((entry) => entry.id !== doctor.id))
      setNotice(`${doctor.name} was rejected.`)
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
          || requestError.message
          || 'Unable to reject doctor.',
      )
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="page-container">
      <header className="page-heading standalone-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION</span>
          <h1>Pending doctor approvals</h1>
          <p>Verify professional credentials before doctors appear in the directory.</p>
        </div>
      </header>

      {error && (
        <div className="panel api-error-state" role="alert">
          <p>{error}</p>
          <Button variant="outline" onClick={refresh}>Retry</Button>
        </div>
      )}
      {notice && <p className="success-message" role="status">{notice}</p>}

      {loading ? (
        <div className="loading-label" role="status">
          <span className="loading-spinner" aria-hidden="true" />Loading pending doctors
        </div>
      ) : error ? null : doctors.length ? (
        <section className="admin-doctor-list" aria-label="Pending doctor applications">
          {doctors.map((doctor) => {
            const licenseNumber = licenseNumbers[doctor.id] || ''
            const isLegacyLicense = licenseNumber.startsWith('LEGACY-UNVERIFIED-')
            return (
              <article className="panel admin-doctor-card" key={doctor.id}>
                <div>
                  <h2>{doctor.name}</h2>
                  <p>{doctor.specialization} · {doctor.qualification}</p>
                  <p>{doctor.email} · {doctor.phone}</p>
                  <p>{doctor.hospitalName} · {doctor.experienceYears} years · ₹{doctor.consultationFee}</p>
                  <span className="status-badge status-pending">{doctor.status}</span>
                </div>
                <div className="admin-doctor-license">
                  <InputField
                    label="License / MCI number"
                    name={`license-${doctor.id}`}
                    value={licenseNumber}
                    onChange={(event) => setLicenseNumbers((current) => ({
                      ...current,
                      [doctor.id]: event.target.value,
                    }))}
                    required
                  />
                  {isLegacyLicense && (
                    <p className="field-error">
                      This existing account has no submitted license. Enter the verified number to approve.
                    </p>
                  )}
                  <div className="appointment-actions">
                    <Button
                      disabled={updatingId === doctor.id || !licenseNumber.trim() || isLegacyLicense}
                      onClick={() => approve(doctor)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      disabled={updatingId === doctor.id}
                      onClick={() => reject(doctor)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      ) : (
        <div className="panel empty-state">
          <h2>No pending doctor applications</h2>
          <p>New applications will appear here for license review.</p>
          <Button variant="outline" onClick={refresh}>
            Refresh
          </Button>
        </div>
      )}
    </div>
  )
}
