import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import useAILanguage from '../hooks/useAILanguage'
import { getSymptomResultCopy } from '../utils/aiTranslations'

const symptomOptions = [
  'Fever',
  'Headache',
  'Cough',
  'Cold',
  'Chest Pain',
  'Stomach Pain',
  'Dizziness',
  'Body Pain',
  'Sore Throat',
  'Difficulty Breathing',
]

function getSymptomResultKey(symptoms) {
  const has = (symptom) => symptoms.includes(symptom)

  if (has('Chest Pain') || has('Difficulty Breathing')) {
    return 'emergency'
  }

  if (has('Fever') && has('Headache') && has('Body Pain')) {
    return 'viral'
  }

  if (has('Cough') && has('Cold') && has('Sore Throat')) {
    return 'cold'
  }

  if (has('Stomach Pain') && has('Fever')) {
    return 'stomach'
  }

  if (has('Dizziness') && has('Headache')) {
    return 'dizziness'
  }

  return 'other'
}

export default function SymptomChecker() {
  const language = useAILanguage()
  const labels = getSymptomResultCopy('other', '1 day', language).labels
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [duration, setDuration] = useState('1 day')
  const [age, setAge] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((current) => current.includes(symptom)
      ? current.filter((item) => item !== symptom)
      : current.length < 3 ? [...current, symptom] : current)
    setResult(null)
    setError('')
  }

  const submit = (event) => {
    event.preventDefault()
    if (selectedSymptoms.length < 2 || selectedSymptoms.length > 3) {
      setError(labels.selectionError)
      return
    }
    if (!age || Number(age) < 1 || Number(age) > 120) {
      setError(labels.ageError)
      return
    }
    setError('')
    setResult(getSymptomResultKey(selectedSymptoms))
  }

  const localizedResult = result ? getSymptomResultCopy(result, duration, language) : null
  const isUrgent = localizedResult?.urgency === 'High'

  return (
    <div className="page-container symptom-checker-page">
      <header className="page-heading standalone-heading">
        <div>
          <span className="eyebrow">{labels.demo}</span>
          <h1>{labels.title}</h1>
          <p>{labels.pageDescription}</p>
        </div>
      </header>

      <form className="panel symptom-form" onSubmit={submit}>
        <fieldset className="symptom-options">
          <legend>{labels.select}</legend>
          {symptomOptions.map((symptom) => (
            <label className="symptom-option" key={symptom}>
              <input
                type="checkbox"
                checked={selectedSymptoms.includes(symptom)}
                disabled={selectedSymptoms.length >= 3 && !selectedSymptoms.includes(symptom)}
                onChange={() => toggleSymptom(symptom)}
              />
              <span>{labels.symptoms[symptom]}</span>
            </label>
          ))}
        </fieldset>

        <div className="symptom-form-fields">
          <label>
            {labels.duration}
            <select value={duration} onChange={(event) => setDuration(event.target.value)}>
              <option value="1 day">{labels.durations[0]}</option>
              <option value="3 days">{labels.durations[1]}</option>
              <option value="1 week">{labels.durations[2]}</option>
            </select>
          </label>
          <label>
            {labels.age}
            <input
              type="number"
              min="1"
              max="120"
              required
              value={age}
              onChange={(event) => setAge(event.target.value)}
              placeholder={labels.agePlaceholder}
            />
          </label>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <Button type="submit">{labels.check}</Button>
      </form>

      {localizedResult && (
        <section className={`panel symptom-result urgency-${localizedResult.urgency.toLowerCase()}`} aria-live="polite">
          <div className="symptom-result-heading">
            <div>
              <span className="eyebrow">{localizedResult.labels.demo}</span>
              <h2>{localizedResult.condition}</h2>
            </div>
            <span className={`risk-badge risk-${localizedResult.urgency.toLowerCase()}`}>
              {localizedResult.urgency === 'High' ? '🔴' : localizedResult.urgency === 'Medium' ? '🟡' : '🟢'} {localizedResult.labels.urgencyTitle}: {localizedResult.urgencyLabel}
            </span>
          </div>
          {localizedResult.confidence && <p className="symptom-confidence">{localizedResult.confidence}</p>}
          <p><strong>{localizedResult.labels.specialist}</strong> {localizedResult.specialist}</p>
          <p><strong>{localizedResult.labels.next}</strong> {localizedResult.urgencyMessage}</p>
          <h3>{localizedResult.labels.selfCare}</h3>
          <ul>{localizedResult.remedies.map((remedy) => <li key={remedy}>{remedy}</li>)}</ul>
          {!isUrgent && (
            <Link
              className="button button-primary"
              to={`/doctors?specialist=${encodeURIComponent(localizedResult.specialistQuery)}`}
            >
              {localizedResult.labels.book}
            </Link>
          )}
          <p className="ai-disclaimer">
            {localizedResult.labels.disclaimer}
          </p>
        </section>
      )}
    </div>
  )
}
