import { useEffect, useMemo, useRef, useState } from 'react'
import Button from './Button'
import useAILanguage from '../hooks/useAILanguage'
import { getGeminiReportNote, isGeminiConfigured } from '../services/aiService'
import {
  analyzeReportText,
  manualValuesToText,
  reportTextFromRecord,
} from '../utils/reportAnalysis'
import { getReportTranslations, localizeReportResult } from '../utils/aiTranslations'

const emptyValues = { hemoglobin: '', sugar: '', bloodPressure: '', cholesterol: '' }

function readHistory(key, reportId) {
  const saved = JSON.parse(localStorage.getItem(key) || '[]')
  if (!Array.isArray(saved)) throw new Error('Saved analysis history has an unexpected format.')
  return saved.find((item) => String(item.reportId) === String(reportId)) || null
}

function getInitialAnalysis(key, reportId) {
  try {
    return { result: readHistory(key, reportId)?.result || null, notice: '' }
  } catch (error) {
    return { result: null, notice: error.message }
  }
}

export default function ReportAIAnalyzer({ report, patientId, reportName }) {
  const language = useAILanguage()
  const translations = getReportTranslations(language)
  const reportId = report?.id ?? report?.reportId ?? reportName
  const historyKey = `healthcare-ai-report-analysis:${patientId}`
  const reportText = useMemo(() => reportTextFromRecord(report), [report])
  const [values, setValues] = useState(emptyValues)
  const [initialAnalysis] = useState(() => getInitialAnalysis(historyKey, reportId))
  const [result, setResult] = useState(initialAnalysis.result)
  const [needsManualValues, setNeedsManualValues] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [shareWithGemini, setShareWithGemini] = useState(false)
  const [notice, setNotice] = useState(initialAnalysis.notice)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  const updateValue = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const analyze = async (event) => {
    event.preventDefault()
    if (analyzing) return

    setAnalyzing(true)
    setNotice('')
    setNeedsManualValues(false)
    await new Promise((resolve) => {
      timerRef.current = window.setTimeout(resolve, 2000)
    })

    const source = manualValuesToText(values) || reportText
    let analysis = analyzeReportText(source)
    if (!analysis) {
      setNeedsManualValues(true)
      setNotice(translations.noNumbers)
      setAnalyzing(false)
      return
    }

    if (isGeminiConfigured && shareWithGemini) {
      try {
        analysis = {
          ...analysis,
          geminiNote: await getGeminiReportNote(analysis.findings, language),
          geminiLanguage: language,
        }
      } catch (error) {
        setNotice(`Gemini is unavailable (${error.message}). The local demo analysis is shown.`)
      }
    }

    setResult(analysis)
    setAnalyzing(false)

    try {
      const saved = JSON.parse(localStorage.getItem(historyKey) || '[]')
      if (!Array.isArray(saved)) throw new Error('Saved analysis history has an unexpected format.')
      const record = {
        reportId,
        reportName,
        analyzedAt: new Date().toISOString(),
        result: analysis,
      }
      const next = [record, ...saved.filter((item) => String(item.reportId) !== String(reportId))]
      localStorage.setItem(historyKey, JSON.stringify(next))
    } catch (error) {
      setNotice(`Analysis is ready but could not be saved to this device: ${error.message}`)
    }
  }

  const localizedResult = localizeReportResult(result, translations)

  return (
    <section className="report-ai-analyzer" aria-label={`AI analysis for ${reportName}`}>
      <div className="report-ai-heading">
        <div>
          <span className="eyebrow">{isGeminiConfigured ? translations.eyebrow : translations.demoEyebrow}</span>
          <h3>{translations.heading}</h3>
          <p>{translations.description}</p>
        </div>
        <Button type="button" onClick={analyze} disabled={analyzing}>
          {analyzing ? translations.analyzing : result ? translations.analyzeAgain : translations.analyze}
        </Button>
      </div>

      {isGeminiConfigured && (
        <label className="ai-gemini-consent report-gemini-consent">
          <input
            type="checkbox"
            checked={shareWithGemini}
            onChange={(event) => setShareWithGemini(event.target.checked)}
          />
          {translations.geminiConsent}
        </label>
      )}

      {analyzing && (
        <div className="report-ai-loading" role="status" aria-live="polite">
          <svg className="report-ecg" viewBox="0 0 640 44" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 22 H150 L170 22 L185 22 L198 5 L212 39 L226 15 L240 22 H330 L350 22 L366 22 L380 9 L394 34 L408 17 L422 22 H640" />
          </svg>
          <strong>{translations.analyzing}</strong>
        </div>
      )}

      {needsManualValues && (
        <form className="report-manual-values" onSubmit={analyze}>
          <p>{translations.manualPrompt}</p>
          <label>
            {translations.hemoglobin}
            <input name="hemoglobin" type="number" step="0.1" value={values.hemoglobin} onChange={updateValue} />
          </label>
          <label>
            {translations.sugar}
            <input name="sugar" type="number" step="1" value={values.sugar} onChange={updateValue} />
          </label>
          <label>
            {translations.pressure}
            <input name="bloodPressure" value={values.bloodPressure} onChange={updateValue} />
          </label>
          <label>
            {translations.cholesterol}
            <input name="cholesterol" type="number" step="1" value={values.cholesterol} onChange={updateValue} />
          </label>
          <Button type="submit" disabled={analyzing}>{translations.manualAnalyze}</Button>
        </form>
      )}

      {notice && <p className="report-ai-notice" role="status">{notice}</p>}

      {localizedResult && (
        <div className="report-ai-result" aria-live="polite">
          <div className="report-ai-result-heading">
            <h4>{localizedResult.summary}</h4>
            <span className={`risk-badge risk-${localizedResult.riskLevel.toLowerCase()}`}>
              {translations.risk}: {localizedResult.localizedRiskLevel}
            </span>
          </div>
          <ul className="report-ai-findings">
            {localizedResult.findings.map((finding) => (
              <li key={finding.name}>
                <span className={`finding-marker finding-${finding.status}`} aria-hidden="true" />
                <div>
                  <strong>{finding.localizedName}: {finding.value}</strong>
                  <span>{finding.localizedReference}</span>
                  <span>{finding.localizedStatus}</span>
                </div>
              </li>
            ))}
          </ul>
          <p><strong>{translations.nextStep}</strong> {localizedResult.recommendations}</p>
          {result.geminiNote && result.geminiLanguage === language && <p className="report-gemini-note">{result.geminiNote}</p>}
          <p className="report-ai-disclaimer">{localizedResult.disclaimer}</p>
          <p className="report-ai-storage">{translations.saved}</p>
        </div>
      )}
    </section>
  )
}
