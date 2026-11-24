import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import DoctorCard from '../components/DoctorCard'
import useDoctors from '../hooks/useDoctors'

export default function Home() {
  const { doctors, loading, error, retry } = useDoctors()
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState({ doctors: 0, patients: 0, rating: 0 })
  const navigate = useNavigate()
  const homeRef = useRef(null)

  useEffect(() => {
    const startedAt = Date.now()
    const duration = 1500
    const timer = window.setInterval(() => {
      const progress = Math.min((Date.now() - startedAt) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setStats({
        doctors: Math.round(50 * eased),
        patients: Math.round(1000 * eased),
        rating: Math.round(48 * eased) / 10,
      })
      if (progress === 1) window.clearInterval(timer)
    }, 30)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const root = homeRef.current
    if (!root) return undefined

    const elements = root.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [loading, doctors])

  const submitSearch = (event) => {
    event.preventDefault()
    const query = search.trim()
    navigate(query ? `/doctors?search=${encodeURIComponent(query)}` : '/doctors')
  }

  return (
    <div className="home-page" ref={homeRef}>
      <section className="hero-section demo-hero">
        <span className="medical-float medical-float-cross" aria-hidden="true">+</span>
        <span className="medical-float medical-float-heart" aria-hidden="true">♥</span>
        <span className="medical-float medical-float-stethoscope" aria-hidden="true">🩺</span>
        <div className="hero-content demo-hero-content">
          <span className="eyebrow hero-eyebrow">HEALTHCARE, MADE SIMPLE</span>
          <h1 className="hero-title hero-animate hero-heading">
            Find the <span>Right Doctor</span>, Right Now.
          </h1>
          <p className="hero-description hero-animate hero-subtext">
            Book appointments with verified doctors, upload reports, and get AI-powered health insights.
          </p>
          <form className="doctor-search-form hero-animate hero-search" role="search" onSubmit={submitSearch}>
            <label className="doctor-search-field">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.2 4.2" />
              </svg>
              <span className="visually-hidden">Search doctors</span>
              <input
                aria-label="Search doctor"
                placeholder="Search Doctor..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <Button type="submit">Search</Button>
          </form>
          <svg className="hero-ecg" viewBox="0 0 760 44" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 22 H180 L198 22 L210 22 L222 5 L236 39 L250 15 L263 22 H360 L378 22 L392 22 L405 9 L419 34 L433 17 L446 22 H760" />
          </svg>
          <Link className="button button-outline symptom-checker-cta" to="/symptom-checker">
            🩺 Check Symptoms with AI
          </Link>
          <Link className="text-link ai-chat-hero-link" to="/ai-chat">Open Healthcare AI chat <span aria-hidden="true">→</span></Link>
          <div className="hero-stats demo-hero-stats hero-animate hero-stat-items" aria-label="Healthcare AI statistics">
            <span><strong>{stats.doctors}+</strong> Doctors</span>
            <span><strong>{stats.patients}+</strong> Patients</span>
            <span><strong>{stats.rating.toFixed(1)}<span className="rating-star">★</span></strong> Rating</span>
          </div>
          <div className="hero-actions demo-hero-actions">
            <Link className="button button-primary" to="/doctors">Explore Doctors</Link>
          </div>
        </div>
      </section>

      <section className="content-section home-doctors demo-home-doctors">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CARE TEAM</span>
            <h2>Meet our doctors</h2>
          </div>
          <Link className="text-link" to="/doctors">Find all doctors <span aria-hidden="true">→</span></Link>
        </div>
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
          <div className="api-error-state" role="alert">
            <p>{error}</p>
            <Button variant="outline" onClick={retry}>Retry</Button>
          </div>
        ) : doctors.length ? (
          <div className="doctor-grid demo-doctor-grid">
          {doctors.slice(0, 3).map((doctor, index) => (
            <div
              className="doctor-reveal"
              data-reveal
              key={doctor.id ?? doctor.name}
              style={{ '--reveal-delay': `${index * 100}ms` }}
            >
              <DoctorCard doctor={doctor} />
            </div>
            ))}
          </div>
        ) : (
          <div className="panel empty-state doctor-empty">
            <span aria-hidden="true">🩺</span>
            <h2>No doctors found</h2>
            <p>Check backend /api/doctors/.</p>
          </div>
        )}
      </section>

      <section className="content-section demo-info-section" id="how-it-works">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THREE SIMPLE STEPS</span>
            <h2>How it works</h2>
          </div>
        </div>
        <div className="demo-info-grid demo-steps-grid">
          <article className="demo-info-card reveal-on-scroll" data-reveal>
            <span className="demo-step-number">1</span>
            <h3>Find Doctor</h3>
            <p>Browse verified doctors and choose the right specialist for you.</p>
          </article>
          <article className="demo-info-card reveal-on-scroll" data-reveal style={{ '--reveal-delay': '100ms' }}>
            <span className="demo-step-number">2</span>
            <h3>Book Appointment</h3>
            <p>Pick a convenient time and send your appointment request online.</p>
          </article>
          <article className="demo-info-card reveal-on-scroll" data-reveal style={{ '--reveal-delay': '200ms' }}>
            <span className="demo-step-number">3</span>
            <h3>Get AI Report</h3>
            <p>Upload reports and explore AI-powered health insights.</p>
          </article>
        </div>
      </section>

      <section className="content-section demo-info-section demo-why-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CARE YOU CAN COUNT ON</span>
            <h2>Why Choose Us</h2>
          </div>
        </div>
        <div className="demo-info-grid demo-benefits-grid">
          <article className="demo-benefit-card reveal-on-scroll" data-reveal><span aria-hidden="true">✓</span><h3>Verified Doctors</h3></article>
          <article className="demo-benefit-card reveal-on-scroll" data-reveal style={{ '--reveal-delay': '100ms' }}><span aria-hidden="true">↗</span><h3>Instant Booking</h3></article>
          <article className="demo-benefit-card reveal-on-scroll" data-reveal style={{ '--reveal-delay': '200ms' }}><span aria-hidden="true">✦</span><h3>AI Report Analysis</h3></article>
          <article className="demo-benefit-card reveal-on-scroll" data-reveal style={{ '--reveal-delay': '300ms' }}><span aria-hidden="true">⌑</span><h3>Secure</h3></article>
        </div>
      </section>
    </div>
  )
}
