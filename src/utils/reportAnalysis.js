function findNumber(text, pattern) {
  const match = text.match(pattern)
  return match ? Number(match[1]) : null
}

export function analyzeReportText(text) {
  const source = String(text || '')
  const findings = []

  const hemoglobin = findNumber(
    source,
    /(?:hemoglobin|hgb|hb)\s*(?:\([^)]+\))?\s*[:=]?\s*(\d{1,2}(?:\.\d+)?)/i,
  )
  if (hemoglobin != null) {
    const status = hemoglobin < 12 ? 'low' : hemoglobin > 15 ? 'high' : 'demo-normal'
    findings.push({
      name: 'Hemoglobin',
      value: `${hemoglobin} g/dL`,
      reference: 'Sample adult demo band: 12–15 g/dL',
      status,
    })
  }

  const sugar = findNumber(
    source,
    /(?:blood\s*)?(?:sugar|glucose)\s*(?:\([^)]+\))?\s*[:=]?\s*(\d{2,3}(?:\.\d+)?)/i,
  )
  if (sugar != null) {
    findings.push({
      name: 'Blood sugar',
      value: `${sugar} mg/dL`,
      reference: 'Interpretation depends on fasting status and lab range',
      status: 'context',
    })
  }

  const pressure = source.match(/\b(?:blood pressure|bp)\s*[:=]?\s*(\d{2,3})\s*\/\s*(\d{2,3})/i)
  if (pressure) {
    const systolic = Number(pressure[1])
    const diastolic = Number(pressure[2])
    const status = systolic >= 140 || diastolic >= 90
      ? 'high'
      : systolic < 90 || diastolic < 60
        ? 'low'
        : 'demo-normal'
    findings.push({
      name: 'Blood pressure',
      value: `${systolic}/${diastolic} mmHg`,
      reference: 'A single reading is not diagnostic',
      status,
    })
  }

  const cholesterol = findNumber(
    source,
    /(?:total\s*)?cholesterol\s*(?:\([^)]+\))?\s*[:=]?\s*(\d{2,3}(?:\.\d+)?)/i,
  )
  if (cholesterol != null) {
    findings.push({
      name: 'Total cholesterol',
      value: `${cholesterol} mg/dL`,
      reference: 'Sample target is under 200 mg/dL; review your lab range',
      status: cholesterol >= 200 ? 'high' : 'demo-normal',
    })
  }

  if (!findings.length) return null

  const flagged = findings.filter((finding) => finding.status === 'low' || finding.status === 'high')
  const lowHemoglobin = findings.some(
    (finding) => finding.name === 'Hemoglobin' && finding.status === 'low',
  )
  const riskLevel = flagged.length > 1 ? 'High' : flagged.length ? 'Medium' : 'Low'
  const summary = lowHemoglobin
    ? 'Low hemoglobin flag in the sample demo reference band'
    : flagged.length
      ? 'One or more values need clinician review'
      : 'Values captured for clinician review'

  return {
    summary,
    summaryKey: lowHemoglobin ? 'lowHemoglobin' : flagged.length ? 'flagged' : 'review',
    findings,
    riskLevel,
    recommendationKey: lowHemoglobin ? 'lowHemoglobin' : 'review',
    recommendations: lowHemoglobin
      ? 'Discuss the result and possible causes with a General Physician. Include iron-containing foods only if suitable for you; do not start supplements without clinician advice.'
      : 'Review these values with your clinician, who can interpret them using your history and the laboratory reference ranges.',
    disclaimer: 'Demo screening only, not a diagnosis. Consult a doctor for confirmation.',
  }
}

export function reportTextFromRecord(report) {
  return [
    report?.extractedText,
    report?.reportText,
    report?.text,
    report?.content,
    report?.ai_summary,
    report?.aiSummary,
  ]
    .filter((value) => typeof value === 'string')
    .join('\n')
}

export function manualValuesToText(values) {
  return [
    values.hemoglobin && `Hemoglobin ${values.hemoglobin}`,
    values.sugar && `Blood Sugar ${values.sugar}`,
    values.bloodPressure && `BP ${values.bloodPressure}`,
    values.cholesterol && `Cholesterol ${values.cholesterol}`,
  ]
    .filter(Boolean)
    .join('\n')
}
