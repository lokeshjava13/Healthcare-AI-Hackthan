import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import InputField from '../components/InputField'
import { registerPatient } from '../services/api'

export default function PatientRegister({ showToast }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    gender: '',
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

  const errors = {
    name: touched.name && form.name.trim().length < 3
      ? 'Name must contain at least 3 characters.'
      : fieldErrors.name || '',
    email: touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
      ? 'Enter a valid email address.'
      : fieldErrors.email || '',
    password: touched.password && form.password.length < 8
      ? 'Password must contain at least 8 characters.'
      : fieldErrors.password || '',
    phone: touched.phone && !/^\d{10}$/.test(form.phone)
      ? 'Phone number must contain exactly 10 digits.'
      : fieldErrors.phone || '',
    age: touched.age && (!form.age || Number(form.age) < 1 || Number(form.age) > 120)
      ? 'Enter an age between 1 and 120.'
      : fieldErrors.age || '',
    gender: touched.gender && !form.gender
      ? 'Gender is required.'
      : fieldErrors.gender || '',
  }

  const isValid = form.name.trim().length >= 3
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    && form.password.length >= 8
    && /^\d{10}$/.test(form.phone)
    && Number(form.age) >= 1
    && Number(form.age) <= 120
    && Boolean(form.gender)

  const submit = async (event) => {
    event.preventDefault()
    setTouched({
      name: true,
      email: true,
      password: true,
      phone: true,
      age: true,
      gender: true,
    })
    if (!isValid) return

    setLoading(true)
    setError('')
    setFieldErrors({})
    try {
      await registerPatient({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone,
        age: Number(form.age),
        gender: form.gender,
        role: 'PATIENT',
      })
      showToast?.('Registration successful. Please login.')
      navigate('/login', { replace: true })
    } catch (requestError) {
      const data = requestError.response?.data
      const message = data?.message || requestError.message || 'Unable to register.'
      const backendErrors = Object.fromEntries(
        Object.entries(data || {}).filter(([field, value]) =>
          Object.hasOwn(errors, field) && typeof value === 'string',
        ),
      )
      if (Object.keys(backendErrors).length) {
        setFieldErrors(backendErrors)
      } else if (/email/i.test(message) && /already|exists/i.test(message)) {
        setFieldErrors({ email: 'This email is already registered. Please sign in.' })
      } else if (/email|phone|password|age|gender|name/i.test(message)) {
        const field = ['email', 'phone', 'password', 'age', 'gender', 'name']
          .find((candidate) => message.toLowerCase().includes(candidate))
        if (field) setFieldErrors({ [field]: message })
        else setError(message)
      } else {
        setError(message)
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
          <span className="eyebrow">PATIENT REGISTRATION</span>
          <h1>Create your patient account</h1>
          <p>Register to find approved doctors and manage your care.</p>
        </div>
      </div>
      <form className="auth-form" onSubmit={submit}>
        <h2>Register as Patient</h2>
        <InputField label="Full Name" name="name" autoComplete="name" value={form.name}
          onChange={(event) => setField('name', event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, name: true }))}
          error={errors.name} required />
        <InputField label="Email" name="email" type="email" autoComplete="email" value={form.email}
          onChange={(event) => setField('email', event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, email: true }))}
          error={errors.email} required />
        <InputField label="Password" name="password" type="password" autoComplete="new-password" value={form.password}
          onChange={(event) => setField('password', event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, password: true }))}
          error={errors.password} minLength={8} required />
        <InputField label="Phone" name="phone" type="tel" inputMode="numeric"
          pattern="[0-9]{10}" maxLength={10} value={form.phone}
          onChange={(event) => setField('phone', event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, phone: true }))}
          error={errors.phone} required />
        <InputField label="Age" name="age" type="number" min="1" max="120" value={form.age}
          onChange={(event) => setField('age', event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, age: true }))}
          error={errors.age} required />
        <div className="input-field">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            className={`text-input${errors.gender ? ' text-input-error' : ''}`}
            value={form.gender}
            onChange={(event) => setField('gender', event.target.value)}
            onBlur={() => setTouched((current) => ({ ...current, gender: true }))}
            aria-invalid={errors.gender ? 'true' : undefined}
            required
          >
            <option value="">Select gender</option>
            <option value="FEMALE">Female</option>
            <option value="MALE">Male</option>
            <option value="OTHER">Other</option>
            <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
          </select>
          {errors.gender && <p className="field-error" role="alert">{errors.gender}</p>}
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <Button type="submit" full disabled={loading || !isValid}>
          {loading ? 'Creating account...' : 'Create patient account'}
        </Button>
        <p className="auth-switch">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </section>
  )
}
