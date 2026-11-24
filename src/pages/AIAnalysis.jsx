import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { getPatientReports, uploadReport } from '../services/reportService'
import { unwrapCollection } from '../utils/collections'

export default function AIAnalysis() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [summary, setSummary] = useState('')
  const [reportName, setReportName] = useState('')
  const [reports, setReports] = useState([])
  const pollTimerRef = useRef(null)

  useEffect(() => {
    let active = true
    const patientId = localStorage.getItem('patientId')
    if (!localStorage.getItem('token') || !patientId) {
      navigate('/login', { replace: true })
      return () => {
        active = false
      }
    }

    getPatientReports(patientId)
      .then((response) => {
        if (active) setReports(unwrapCollection(response) || [])
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || requestError.message)
      })
    return () => {
      active = false
      if (pollTimerRef.current) window.clearInterval(pollTimerRef.current)
    }
  }, [navigate])

  const stopPolling = () => {
    if (pollTimerRef.current) {
      window.clearInterval(pollTimerRef.current)
      pollTimerRef.current = null
    }
  }

  const handleUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const patientId = localStorage.getItem('patientId')
    if (!localStorage.getItem('token') || !patientId) {
      navigate('/login', { replace: true })
      return
    }

    stopPolling()
    setUploading(true)
    setAnalyzing(false)
    setSummary('')
    setError('')
    setReportName(file.name)

    try {
      const uploadResponse = await uploadReport(patientId, file)
      const uploaded = uploadResponse?.data ?? uploadResponse
      setUploading(false)
      setAnalyzing(true)

      const uploadedId = uploaded?.id
      let attempts = 0

      const poll = async () => {
        attempts += 1
        try {
          const response = await getPatientReports(patientId)
          const reports = unwrapCollection(response) || []
          setReports(reports)
          const matched = uploadedId
            ? reports.find((report) => String(report.id) === String(uploadedId))
            : reports.find((report) =>
              String(report.report_name || report.reportName || '').toLowerCase() === file.name.toLowerCase())
            || reports[0]

          const status = String(matched?.status || uploaded?.status || '').toUpperCase()
          if (status === 'COMPLETED') {
            stopPolling()
            setAnalyzing(false)
            setSummary(matched?.ai_summary || matched?.aiSummary || uploaded?.ai_summary || uploaded?.aiSummary || 'Analysis completed.')
            return true
          } else if (status === 'FAILED') {
            stopPolling()
            setAnalyzing(false)
            setError(matched?.error || 'AI analysis failed.')
            return true
          } else if (attempts >= 30) {
            stopPolling()
            setAnalyzing(false)
            setError('Analysis is taking longer than expected. Check Reports for the final result.')
            return true
          }
        } catch (requestError) {
          stopPolling()
          setAnalyzing(false)
          setError(requestError.response?.data?.message || requestError.message)
          return true
        }
        return false
      }

      const finishedImmediately = await poll()
      if (!finishedImmediately) {
        pollTimerRef.current = window.setInterval(poll, 3000)
      }
    } catch (requestError) {
      setUploading(false)
      setAnalyzing(false)
      setError(requestError.response?.data?.message || requestError.message)
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="page-container">
      <header className="page-heading standalone-heading">
        <div>
          <span className="eyebrow">HEALTHCARE AI</span>
          <h1>AI Analysis</h1>
          <p>Upload a medical report for AI-assisted review.</p>
        </div>
      </header>

      <section className="panel ai-analysis-upload">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/*"
          onChange={handleUpload}
          hidden
        />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || analyzing}
        >
          {uploading ? 'Uploading...' : analyzing ? 'Analyzing...' : 'Choose PDF or Image'}
        </Button>

        {analyzing && (
          <div className="ai-analysis-status" role="status" aria-live="polite">
            <span className="loading-spinner" aria-hidden="true" />
            <div>
              <strong>Analyzing...</strong>
              <span>{reportName}</span>
            </div>
          </div>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
      </section>

      {summary && (
        <section className="panel ai-summary-card" aria-live="polite">
          <span className="eyebrow">AI SUMMARY</span>
          <h2>{reportName || 'Medical report'}</h2>
          <p>{summary}</p>
        </section>
      )}
      {reports.length > 0 && (
        <section className="panel ai-summary-card">
          <span className="eyebrow">YOUR REPORTS</span>
          <ul>
            {reports.map((report) => (
              <li key={report.id}>
                <strong>{report.report_name || report.reportName || 'Medical report'}</strong>
                <span> · {String(report.status || 'PENDING').toUpperCase()}</span>
                {(report.ai_summary || report.aiSummary) && (
                  <p>{report.ai_summary || report.aiSummary}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
