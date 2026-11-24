import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import ReportAIAnalyzer from '../components/ReportAIAnalyzer'
import { getPatientReports, uploadReport } from '../services/reportService'
import { unwrapCollection } from '../utils/collections'

const statusClasses = {
  PENDING: 'status-pending',
  PROCESSING: 'status-processing',
  COMPLETED: 'status-confirmed',
  FAILED: 'status-cancelled',
}

function getReportIdentity(report) {
  return String(
    report?.id
      ?? report?.reportId
      ?? report?.report_name
      ?? report?.reportName
      ?? report?.title
      ?? report?.name
      ?? 'Medical report',
  )
}

export default function Reports() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)
  const [analysisReport, setAnalysisReport] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const fileInputRef = useRef(null)

  useEffect(() => {
    let active = true
    const patientId = localStorage.getItem('patientId')
    if (!localStorage.getItem('token') || !patientId) {
      navigate('/login', { replace: true })
      return () => {
        active = false
      }
    }

    const loadReports = async () => {
      try {
        const response = await getPatientReports(patientId)
        const reportList = unwrapCollection(response)
        if (!reportList) throw new Error('Unexpected response from the patient reports endpoint.')
        if (!active) return
        setReports(reportList)
        setError('')
      } catch (requestError) {
        if (!active) return
        setReports([])
        setError(requestError.response?.data?.message || requestError.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadReports()
    return () => {
      active = false
    }
  }, [navigate, reloadKey])

  const retry = () => {
    setLoading(true)
    setError('')
    setReloadKey((key) => key + 1)
  }

  const handleUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const patientId = localStorage.getItem('patientId')
    if (!localStorage.getItem('token') || !patientId) {
      navigate('/login', { replace: true })
      return
    }
    setUploading(true)
    setError('')
    try {
      await uploadReport(patientId, file)
      setLoading(true)
      setReloadKey((key) => key + 1)
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message)
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const formatDate = (value) => {
    if (!value) return 'Date unavailable'
    const date = new Date(value)
    return Number.isNaN(date.getTime())
      ? String(value)
      : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="page-container">
      <header className="page-heading standalone-heading">
        <div>
          <span className="eyebrow">YOUR REPORTS</span>
          <h1>Reports</h1>
          <p>Review your medical reports.</p>
        </div>
        <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload report'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/*"
          onChange={handleUpload}
          hidden
        />
      </header>
      <section className="panel reports-panel">
        <div className="panel-heading">
          <div><h2>Recent reports</h2></div>
        </div>
        {loading ? (
          <div className="report-list" role="status" aria-label="Loading reports">
            {Array.from({ length: 3 }, (_, index) => (
              <article className="report-row report-skeleton-row" key={index} aria-hidden="true">
                <span className="skeleton skeleton-avatar" />
                <span className="skeleton skeleton-title" />
                <span className="skeleton skeleton-line short" />
              </article>
            ))}
          </div>
        ) : error ? (
          <div className="api-error-state" role="alert">
            <p>{error}</p>
            <Button variant="outline" onClick={retry}>Retry</Button>
          </div>
        ) : reports.length ? (
          <div className="report-list">
            {reports.map((report, index) => {
              const status = String(report?.status || 'PENDING').toUpperCase()
              const title = String(report?.report_name || report?.reportName || report?.title || report?.name || 'Medical report')
              const date = formatDate(report?.uploaded_at || report?.uploadedAt || report?.createdAt || report?.date)
              const isSelected = selectedReport && getReportIdentity(selectedReport) === getReportIdentity(report)
              const isAnalysisOpen = analysisReport
                && getReportIdentity(analysisReport) === getReportIdentity(report)
              return (
                <article className="report-row" key={report?.id ?? `${title}-${index}`}>
                  <span className="report-icon" aria-hidden="true">🛡️</span>
                  <div className="report-info">
                    <strong>{title}</strong>
                    <span>Added {date}</span>
                  </div>
                  <span className={`status-badge ${statusClasses[status] || 'status-pending'}`}>
                    {status}
                  </span>
                  <button
                    className="button button-outline"
                    type="button"
                    onClick={() => setSelectedReport(isSelected ? null : report)}
                    aria-expanded={isSelected}
                  >
                    {isSelected ? 'Hide analysis' : 'View analysis'}
                  </button>
                  <Button
                    variant="primary"
                    type="button"
                    onClick={() => setAnalysisReport(isAnalysisOpen ? null : report)}
                  >
                    {isAnalysisOpen ? 'Close AI analysis' : 'Analyze with AI'}
                  </Button>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="empty-state report-empty">
            <span aria-hidden="true">🛡️</span>
            <h2>No reports yet. Upload your first report</h2>
            <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              Upload report
            </Button>
          </div>
        )}
      </section>
      {selectedReport && (
        <section className="panel report-detail" aria-live="polite">
          <span className="eyebrow">AI SUMMARY</span>
          <h2>{selectedReport.report_name || selectedReport.reportName || selectedReport.name || 'Medical report'}</h2>
          <p>{selectedReport.ai_summary || selectedReport.aiSummary || 'No AI summary is available for this report yet.'}</p>
        </section>
      )}
      {analysisReport && (
        <ReportAIAnalyzer
          key={getReportIdentity(analysisReport)}
          report={analysisReport}
          patientId={localStorage.getItem('patientId')}
          reportName={String(
            analysisReport.report_name
              || analysisReport.reportName
              || analysisReport.title
              || analysisReport.name
              || 'Medical report',
          )}
        />
      )}
      <aside className="report-disclaimer">
        <strong>Private health information</strong>
        <p>Only access medical reports through your authorized Healthcare AI account.</p>
      </aside>
      <Link className="text-link reports-book-link" to="/book-appointment">Book a visit <span aria-hidden="true">→</span></Link>
    </div>
  )
}
