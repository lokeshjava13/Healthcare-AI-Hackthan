import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'
import InputField from './InputField'

export default function AuthForm({ mode, onSubmit, error, fieldErrors = {}, onFieldChange, loading = false, registrationValidation = false, roleSelector }) {
  const isLogin = mode === 'login'
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState({})

  const nameError = !isLogin && touched.name
    ? (!name.trim()
      ? 'Name is required.'
      : name.trim().length < (registrationValidation ? 3 : 2)
        ? 'Name must contain at least 3 characters.'
        : '')
    : ''
  const phoneError = !isLogin && (touched.phone || fieldErrors.phone)
    ? (!phone
      ? 'Phone number must contain exactly 10 digits'
      : !/^\d{10}$/.test(phone)
        ? 'Phone number must contain exactly 10 digits'
        : fieldErrors.phone || '')
    : ''
  const emailError = (touched.email || fieldErrors.email)
    ? (fieldErrors.email
      || (!email ? 'Email is required.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ? 'Enter a valid email address.'
        : ''))
    : ''
  const passwordError = (touched.password || fieldErrors.password)
    ? (fieldErrors.password
      || (!password
      ? 'Password must be at least 8 characters'
      : isLogin && password.length < 6
        ? 'Password must be at least six characters.'
        : !isLogin && password.length < 8
          ? 'Password must contain at least 8 characters'
          : ''))
    : ''

  const registrationValid = isLogin || (
    name.trim().length >= (registrationValidation ? 3 : 2)
    && /^\d{10}$/.test(phone)
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    && password.length >= 8
  )
  const loginValid = isLogin
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    && password.length >= 6
  const isValid = isLogin ? loginValid : registrationValid

  const submit = (event) => {
    event.preventDefault()
    setTouched(isLogin
      ? { email: true, password: true }
      : { name: true, phone: true, email: true, password: true })
    if (!isLogin && name.trim().length < (registrationValidation ? 3 : 2)) {
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return
    }
    if (isLogin && password.length < 6) {
      return
    }
    if (!isLogin && (!/^\d{10}$/.test(phone) || password.length < 8)) {
      return
    }

    onSubmit({ name: name.trim(), email: email.trim(), password, phone: phone.trim() })
  }

  return (
    <section className="auth-panel">
      <div className="auth-intro">
        <img
          className="auth-intro-image"
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
          alt="Healthcare professional discussing a care plan"
          loading="lazy"
        />
        <div className="auth-intro-overlay" aria-hidden="true" />
        <div className="auth-intro-content">
          <span className="eyebrow">HEALTHCARE, MADE CLEARER</span>
          <h1>Your Health, In One Place ✚</h1>
          <p>Explore a frontend demo for appointments, care teams, and reports.</p>
          <ul>
            <li>Browse sample doctors and appointment slots</li>
            <li>Keep track of demo appointments</li>
            <li>Secure access to your Healthcare AI account</li>
          </ul>
        </div>
      </div>
      <form className="auth-form" onSubmit={submit}>
        <h2>{isLogin ? 'Welcome back' : 'Create your patient account'}</h2>
        <p className="muted-copy">Your account is managed by Healthcare AI.</p>
        {isLogin && roleSelector && (
          <div className="role-selector" aria-label="Login role">
            {['PATIENT', 'DOCTOR'].map((option) => (
              <button
                key={option}
                type="button"
                className={`role-option${roleSelector.value === option ? ' active' : ''}`}
                aria-pressed={roleSelector.value === option}
                onClick={() => roleSelector.onChange(option)}
              >
                {option === 'PATIENT' ? 'Patient' : 'Doctor'}
              </button>
            ))}
          </div>
        )}
        {!isLogin && (
          <>
            <InputField
              label="Name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setTouched((current) => ({ ...current, name: true }))
                onFieldChange?.('name')
              }}
              onBlur={() => setTouched((current) => ({ ...current, name: true }))}
              error={nameError}
              placeholder="Your name"
              required
            />
            <InputField
              label="Phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value)
                setTouched((current) => ({ ...current, phone: true }))
                onFieldChange?.('phone')
              }}
              onBlur={() => setTouched((current) => ({ ...current, phone: true }))}
              error={phoneError}
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              placeholder="Your phone number"
              required
            />
          </>
        )}
        <InputField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            setTouched((current) => ({ ...current, email: true }))
            onFieldChange?.('email')
          }}
          onBlur={() => setTouched((current) => ({ ...current, email: true }))}
          error={emailError}
          placeholder="you@example.com"
          required
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            setTouched((current) => ({ ...current, password: true }))
            onFieldChange?.('password')
          }}
          onBlur={() => setTouched((current) => ({ ...current, password: true }))}
          error={passwordError}
          placeholder={isLogin ? 'At least 6 characters' : 'At least 8 characters'}
          minLength={isLogin ? 6 : 8}
          required
        />
        {error && (
          <p className="form-error" role="alert">{error}</p>
        )}
        <Button type="submit" full disabled={loading || !isValid}>
          {loading ? 'Connecting...' : isLogin ? 'Sign in' : 'Create account'}
        </Button>
        <p className="auth-switch">
          {isLogin ? 'New to Healthcare AI? Register as:' : 'Already have an account? '}
          {!isLogin && <Link to="/login">Sign in</Link>}
        </p>
        {isLogin && (
          <div className="auth-registration-actions">
            <Link className="button button-outline" to="/register/patient">
              Register as Patient
            </Link>
            <Link className="button button-outline" to="/register/doctor">
              Register as Doctor
            </Link>
          </div>
        )}
      </form>
    </section>
  )
}
