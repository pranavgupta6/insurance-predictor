import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const FIELD_META = {
  sex:    { 0: 'Male',      1: 'Female' },
  smoker: { 0: 'Smoker',    1: 'Non-smoker' },
  region: { 0: 'Southeast', 1: 'Southwest', 2: 'Northeast', 3: 'Northwest' },
}

// Chevron SVG for selects — color changes with theme via CSS var
const chevronUrl = (color) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='${encodeURIComponent(color)}' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`

export default function App() {
  const [dark, setDark] = useState(false)
  const [form, setForm] = useState({ age: '', sex: '0', bmi: '', children: '', smoker: '0', region: '0' })
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const resultRef = useRef(null)

  // Sync dark class to <html> so body & #root background also switches
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const validate = () => {
    const e = {}
    if (!form.age || isNaN(form.age) || +form.age < 1 || +form.age > 120) e.age = 'Enter a valid age (1–120)'
    if (!form.bmi || isNaN(form.bmi) || +form.bmi < 10 || +form.bmi > 70) e.bmi = 'Enter a valid BMI (10–70)'
    if (form.children === '' || isNaN(form.children) || +form.children < 0 || +form.children > 10) e.children = 'Enter children count (0–10)'
    return e
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: undefined })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setLoading(true)
    setApiError(null)
    setResult(null)
    try {
      const res = await axios.post('http://localhost:5000/predict', {
        age: +form.age, sex: +form.sex, bmi: +form.bmi,
        children: +form.children, smoker: +form.smoker, region: +form.region
      })
      setResult(res.data.predicted_cost)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
    } catch {
      setApiError('Could not reach the server. Make sure Flask is running on port 5000.')
    }
    setLoading(false)
  }

  const handleReset = () => {
    setForm({ age: '', sex: '0', bmi: '', children: '', smoker: '0', region: '0' })
    setErrors({})
    setResult(null)
    setApiError(null)
  }

  // Select chevron color must match --text-muted per theme
  const chevronColor = dark ? '#4b5563' : '#9ca3af'
  const showReset = result !== null || Object.keys(form).some(k => form[k] !== '' && form[k] !== '0')

  return (
    <div className={`app${dark ? ' dark' : ''}`}>

      {/* Theme toggle */}
      <div className="top-bar">
        <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label="Toggle theme">
          <span className="toggle-icon">{dark ? '☀️' : '🌙'}</span>
          {dark ? 'Light mode' : 'Dark mode'}
        </button>
      </div>

      {/* Header */}
      <div className="header">
        <div className="badge">ML-Powered Predictor</div>
        <h1 className="title">Medical Insurance<br />Cost Estimator</h1>
        <p className="subtitle">Linear regression model · R² 0.74 on test data</p>
      </div>

      {/* Form card */}
      <div className="card">
        <form onSubmit={handleSubmit} noValidate>

          <p className="section-label">Personal Info</p>

          <div className="form-row">
            <div className="field">
              <label className="field-label">Age</label>
              <input
                className={`field-input${errors.age ? ' has-error' : ''}`}
                name="age" type="number" value={form.age}
                onChange={handleChange} placeholder="e.g. 32"
              />
              {errors.age && <span className="error-text">{errors.age}</span>}
            </div>
            <div className="field">
              <label className="field-label">Sex</label>
              <select
                className="field-select"
                style={{ backgroundImage: chevronUrl(chevronColor) }}
                name="sex" value={form.sex} onChange={handleChange}
              >
                <option value="0">Male</option>
                <option value="1">Female</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label className="field-label">BMI</label>
              <input
                className={`field-input${errors.bmi ? ' has-error' : ''}`}
                name="bmi" type="number" step="0.1" value={form.bmi}
                onChange={handleChange} placeholder="e.g. 26.5"
              />
              {errors.bmi && <span className="error-text">{errors.bmi}</span>}
            </div>
            <div className="field">
              <label className="field-label">Children</label>
              <input
                className={`field-input${errors.children ? ' has-error' : ''}`}
                name="children" type="number" value={form.children}
                onChange={handleChange} placeholder="e.g. 1"
              />
              {errors.children && <span className="error-text">{errors.children}</span>}
            </div>
          </div>

          <hr className="divider" />
          <p className="section-label">Health & Location</p>

          <div className="form-row">
            <div className="field">
              <label className="field-label">Smoker</label>
              <select
                className="field-select"
                style={{ backgroundImage: chevronUrl(chevronColor) }}
                name="smoker" value={form.smoker} onChange={handleChange}
              >
                <option value="0">Yes</option>
                <option value="1">No</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label">Region</label>
              <select
                className="field-select"
                style={{ backgroundImage: chevronUrl(chevronColor) }}
                name="region" value={form.region} onChange={handleChange}
              >
                <option value="0">Southeast</option>
                <option value="1">Southwest</option>
                <option value="2">Northeast</option>
                <option value="3">Northwest</option>
              </select>
            </div>
          </div>

          <hr className="divider" />

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? 'Calculating...' : 'Estimate Cost'}
          </button>

          {showReset && (
            <button className="btn-reset" type="button" onClick={handleReset}>
              Reset
            </button>
          )}
        </form>

        {apiError && <div className="api-error">{apiError}</div>}
      </div>

      {/* Result card */}
      {result !== null && (
        <div className="result-card" ref={resultRef}>
          <p className="section-label">Estimated Annual Cost</p>

          <div className="cost-row">
            <span className="cost-sign">$</span>
            <span className="cost-value">
              {result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="cost-label">per year · based on your inputs</p>

          <div className="summary-grid">
            {[
              { label: 'Age',      value: `${form.age} yrs` },
              { label: 'BMI',      value: form.bmi },
              { label: 'Children', value: form.children },
              { label: 'Sex',      value: FIELD_META.sex[form.sex] },
              { label: 'Smoker',   value: FIELD_META.smoker[form.smoker] },
              { label: 'Region',   value: FIELD_META.region[form.region] },
            ].map(({ label, value }) => (
              <div className="chip" key={label}>
                <div className="chip-label">{label}</div>
                <div className="chip-value">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
