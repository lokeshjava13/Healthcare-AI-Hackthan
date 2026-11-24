import { useId } from 'react'

export default function InputField({ label, id, className = '', error, ...inputProps }) {
  const generatedId = useId()
  const inputId = id || inputProps.name || generatedId

  return (
    <div className={`input-field${className ? ` ${className}` : ''}`}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        className={`text-input${error ? ' text-input-error' : ''}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...inputProps}
      />
      {error && <p id={`${inputId}-error`} className="field-error" role="alert">{error}</p>}
    </div>
  )
}