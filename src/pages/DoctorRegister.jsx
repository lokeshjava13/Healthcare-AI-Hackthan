import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import InputField from '../components/InputField'
import { registerDoctor } from '../services/doctorService'

const specializations = [
  'Cardiologist',
  'Dermatologist',
  'General Physician',
  'Gynecologist',
  'Neurologist',
  'Orthopedic',
  'Pediatrician',
  'Physiotherapist',
]

export default function DoctorRegister({ showToast }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    specialization: '',
    qualification: '',
    licenseNumber: '',
    hospitalName: '',
    experienceYears: '',
    consultationFee: '',
  })
  const [touched, setTouched] = useState({})
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setTouched((current) => ({ ...current, [field]: true }))
    setFieldErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const nameError = touched.name && form.name.trim().length < 3
    ? 'Name must contain at least 3 characters.'
    : fieldErrors.name || ''
  const emailError = touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ? 'Enter a valid email address.'
    : fieldErrors.email || ''
  const phoneError = touched.phone && !/^\d{10}$/.test(form.phone)
    ? 'Phone number must contain exactly 10 digits'
    : fieldErrors.phone || ''
  const passwordError = touched.password && form.password.length < 8
    ? 'Password must contain at least 8 characters'
    : fieldErrors.password || ''
  const specializationError = touched.specialization && !form.specialization.trim()
    ? 'Specialization is required.'
    : fieldErrors.specialization || ''
  const qualificationError = touched.qualification && !form.qualification.trim()
    ? 'Qualification is required.'
    : fieldErrors.qualification || ''
  const licenseError = touched.licenseNumber && !form.licenseNumber.trim()
    ? 'License number is required.'
    : fieldErrors.licenseNumber || ''
  const hospitalError = touched.hospitalName && !form.hospitalName.trim()
    ? 'Hospital name is required.'
    : fieldErrors.hospitalName || ''
  const experienceError = touched.experienceYears
    && (!form.experienceYears || Number(form.experienceYears) < 0)
    ? 'Enter valid years of experience.'
    : fieldErrors.experienceYears || ''
  const feeError = touched.consultationFee
    && (!form.consultationFee || Number(form.consultationFee) <= 0)
    ? 'Enter a valid consultation fee.'
    : fieldErrors.consultationFee || ''

  const isValid = form.name.trim().length >= 3
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    && /^\d{10}$/.test(form.phone)
    && form.password.length >= 8
    && form.specialization.trim()
    && form.qualification.trim()
    && form.licenseNumber.trim()
    && form.hospitalName.trim()
    && form.experienceYears !== ''
    && Number(form.experienceYears) >= 0
    && Number(form.consultationFee) > 0

  const submit = async (event) => {
    event.preventDefault()
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      specialization: true,
      qualification: true,
      licenseNumber: true,
      hospitalName: true,
      experienceYears: true,
      consultationFee: true,
    })
    if (!isValid) return

    setError('')
    setFieldErrors({})
    setLoading(true)
    try {
      await registerDoctor({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        specialization: form.specialization.trim(),
        qualification: form.qualification.trim(),
        licenseNumber: form.licenseNumber.trim(),
        hospitalName: form.hospitalName.trim(),
        experienceYears: Number(form.experienceYears),
        consultationFee: Number(form.consultationFee),
        role: 'DOCTOR',
      })
      showToast?.('Registration submitted. Your account is pending admin approval. You will be able to login after admin verifies your license.')
      navigate('/login', { replace: true })
    } catch (requestError) {
      const data = requestError?.response?.data
      const payload = data?.data && typeof data.data === 'object' ? data.data : data
      const message = typeof payload?.message === 'string'
        ? payload.message
        : typeof payload?.error === 'string'
          ? payload.error
          : requestError.message

      const backendFieldErrors = Object.fromEntries(
        Object.entries(payload || {}).filter(([field, value]) =>
          ['name', 'email', 'phone', 'password', 'specialization', 'qualification',
            'licenseNumber', 'hospitalName', 'experienceYears', 'consultationFee']
            .includes(field)
          && typeof value === 'string',
        ),
      )
      if (Object.keys(backendFieldErrors).length) {
        setFieldErrors(backendFieldErrors)
      } else if (/license/i.test(message || '')) {
        setFieldErrors({ licenseNumber: message })
      } else if (/email/i.test(message || '') && /already|exists/i.test(message)) {
        setFieldErrors({ email: 'This email is already registered. Please Sign in.' })
      } else if (/phone/i.test(message || '')) {
        setFieldErrors({ phone: message })
      } else if (/password/i.test(message || '')) {
        setFieldErrors({ password: message })
      } else if (/specialization/i.test(message || '')) {
        setFieldErrors({ specialization: message })
      } else if (/qualification/i.test(message || '')) {
        setFieldErrors({ qualification: message })
      } else if (/hospital/i.test(message || '')) {
        setFieldErrors({ hospitalName: message })
      } else if (/experience/i.test(message || '')) {
        setFieldErrors({ experienceYears: message })
      } else if (/fee/i.test(message || '')) {
        setFieldErrors({ consultationFee: message })
      } else if (/email/i.test(message || '')) {
        setFieldErrors({ email: message })
      } else {
        setError(message || 'Unable to create doctor account.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-panel">
      <div className="auth-intro">
        <div className="auth-intro-overlay" aria-hidden="true" />
        <div className="auth-intro-content">
          <span className="eyebrow">DOCTOR REGISTRATION</span>
          <h1>Join the Healthcare AI Care Team</h1>
          <p>Create your doctor account to manage appointments.</p>
        </div>
      </div>
      <form className="auth-form" onSubmit={submit}>
        <h2>Create doctor account</h2>
        <p className="muted-copy">Enter your professional and account details.</p>
        <InputField label="Full Name *" name="name" value={form.name}
          onChange={(event) => setField('name', event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, name: true }))}
          error={nameError} placeholder="Dr. Full name" required />
        <InputField label="Email" name="email" type="email" value={form.email}
          onChange={(event) => setField('email', event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, email: true }))}
          error={emailError} placeholder="doctor@example.com" required />
        <InputField label="Phone" name="phone" type="tel" value={form.phone}
          onChange={(event) => setField('phone', event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, phone: true }))}
          error={phoneError} inputMode="numeric" pattern="[0-9]{10}" maxLength={10}
          placeholder="10-digit phone number" required />
        <InputField label="Password" name="password" type="password" value={form.password}
          onChange={(event) => setField('password', event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, password: true }))}
          error={passwordError} placeholder="At least 8 characters" minLength={8} required />
        <div className="input-field">
          <label htmlFor="specialization">Specialization *</label>
          <select
            id="specialization"
            name="specialization"
            className={`text-input${specializationError ? ' text-input-error' : ''}`}
            value={form.specialization}
            onChange={(event) => setField('specialization', event.target.value)}
            onBlur={() => setTouched((current) => ({ ...current, specialization: true }))}
            aria-invalid={specializationError ? 'true' : undefined}
            required
          >
            <option value="">Select a specialization</option>
            {specializations.map((specialization) => (
              <option key={specialization} value={specialization}>{specialization}</option>
            ))}
          </select>
          {specializationError && <p className="field-error" role="alert">{specializationError}</p>}
        </div>
        <InputField label="Qualification *" name="qualification" value={form.qualification}
          onChange={(event) => setField('qualification', event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, qualification: true }))}
          error={qualificationError} placeholder="MBBS, MD" required />
        <InputField label="License Number / MCI Registration Number *" name="licenseNumber" value={form.licenseNumber}
          onChange={(event) => setField('licenseNumber', event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, licenseNumber: true }))}
          error={licenseError} placeholder="Medical license number" required />
        <InputField label="Hospital Name *" name="hospitalName" value={form.hospitalName}
          onChange={(event) => setField('hospitalName', event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, hospitalName: true }))}
          error={hospitalError} placeholder="Hospital or clinic" required />
        <InputField label="Experience Years *" name="experienceYears" type="number" value={form.experienceYears}
          onChange={(event) => setField('experienceYears', event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, experienceYears: true }))}
          error={experienceError} placeholder="Years of experience" min="0" required />
        <InputField label="Consultation Fee *" name="consultationFee" type="number"
          value={form.consultationFee}
          onChange={(event) => setField('consultationFee', event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, consultationFee: true }))}
          error={feeError} placeholder="500" min="1" required />
        {error && <p className="form-error" role="alert">{error}</p>}
        <Button type="submit" full disabled={loading || !isValid}>
          {loading ? 'Submitting...' : 'Submit for approval'}
        </Button>
        <p className="auth-switch">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </section>
  )
}
