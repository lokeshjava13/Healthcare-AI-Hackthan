export default function StatCard({ title, value, subtitle, icon }) {
  return (
    <article className="stat-card">
      {icon && <span className="stat-icon" aria-hidden="true">{icon}</span>}
      <p className="stat-label">{title}</p>
      <strong className="stat-value">{value}</strong>
      {subtitle && <p className="stat-subtitle">{subtitle}</p>}
    </article>
  )
}