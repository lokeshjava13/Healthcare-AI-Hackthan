import Button from './Button'

export default function DemoDataBanner({ onRetry }) {
  return (
    <div className="demo-fallback-banner" role="status">
      <span>Backend not available, showing demo data.</span>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>Retry</Button>
      )}
    </div>
  )
}
