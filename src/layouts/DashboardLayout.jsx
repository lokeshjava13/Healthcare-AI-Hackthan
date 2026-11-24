import Sidebar from '../components/Sidebar'

export default function DashboardLayout({ role, title, description, children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <section className="dashboard-content">
        <header className="page-heading">
          <div>
            <span className="eyebrow">{role} workspace</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </header>
        {children}
      </section>
    </div>
  )
}
