import { NavLink } from 'react-router-dom'

const linksByRole = {
  Patient: [
    { to: '/dashboard', label: 'Overview' },
    { to: '/doctors', label: 'Find doctors' },
    { to: '/book-appointment', label: 'Book appointment' },
    { to: '/my-appointments', label: 'My appointments' },
    { to: '/reports', label: 'Reports' },
    { to: '/ai-analysis', label: 'AI Analysis' },
  ],
  Doctor: [
    { to: '/doctor', label: 'Dashboard (Doctor)' },
    { to: '/doctor#patients', label: 'My Patients' },
    { to: '/doctor#appointments', label: 'Appointments' },
  ],
}

export default function Sidebar({ role }) {
  const visibleLinks = linksByRole[role] || []

  return (
    <aside className="dashboard-sidebar" aria-label="Dashboard navigation">
      <p className="sidebar-heading">{role} workspace</p>
      <nav className="sidebar-links">
        {visibleLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
