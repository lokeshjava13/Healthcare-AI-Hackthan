import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from './Button'

const navigationLinks = [
  { to: '/', label: 'Home' },
  { to: '/doctors', label: 'Find Doctors' },
  { to: '/#how-it-works', label: 'How it works' },
]

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 8)
    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollState)
  }, [])

  const closeDropdown = (event) => {
    const dropdown = event.currentTarget.closest('details')
    if (dropdown) dropdown.open = false
  }
  const displayName = user?.role === 'PATIENT'
    ? localStorage.getItem('patientName') || user.name
    : user?.name

  return (
    <header className={`site-nav demo-navbar${scrolled ? ' is-scrolled' : ''}`}>
      <Link to="/" className="brand-logo demo-brand" aria-label="Healthcare AI home">
        <span className="brand-mark" aria-hidden="true">+</span>
        <span><b>Healthcare AI</b></span>
      </Link>
      <nav className="top-nav-links demo-nav-links" aria-label="Main navigation">
        {navigationLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="top-nav-link"
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="nav-account demo-nav-account">
        {user ? (
          <>
            <span className="nav-greeting">{displayName}</span>
            <Button
              variant="outline"
              onClick={() => {
                onLogout()
                navigate('/')
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <details className="nav-dropdown">
              <summary className="button button-outline">
                Login <span aria-hidden="true">▾</span>
              </summary>
              <div className="nav-dropdown-menu">
                <Link to="/login" onClick={closeDropdown}>Patient Login</Link>
                <Link to="/doctor-login" onClick={closeDropdown}>Doctor Login</Link>
                <Link to="/admin/login" onClick={closeDropdown}>Admin Login</Link>
              </div>
            </details>
            <details className="nav-dropdown">
              <summary className="button button-primary">
                Get Started <span aria-hidden="true">▾</span>
              </summary>
              <div className="nav-dropdown-menu">
                <Link to="/register/patient" onClick={closeDropdown}>Register as Patient</Link>
                <Link to="/register/doctor" onClick={closeDropdown}>Register as Doctor</Link>
              </div>
            </details>
          </>
        )}
      </div>
    </header>
  )
}
