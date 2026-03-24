import { useState } from 'react'
import axios from 'axios'

function App() {
  const [form, setForm] = useState({
    age: '', sex: '0', bmi: '', children: '', smoker: '0', region: '0'
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = {
        age:      parseInt(form.age),
        sex:      parseInt(form.sex),
        bmi:      parseFloat(form.bmi),
        children: parseInt(form.children),
        smoker:   parseInt(form.smoker),
        region:   parseInt(form.region)
      }
      const res = await axios.post('http://localhost:5000/predict', payload)
      setResult(res.data.predicted_cost)
    } catch (err) {
      setError('Prediction failed. Make sure the Flask server is running.')
    }
    setLoading(false)
  }

  const styles = {
    container: { maxWidth: '480px', margin: '60px auto', fontFamily: 'sans-serif', padding: '0 16px' },
    title: { textAlign: 'center', marginBottom: '24px', color: '#1a1a2e' },
    label: { display: 'block', marginBottom: '4px', fontWeight: '600', color: '#333' },
    input: { width: '100%', padding: '8px 10px', marginBottom: '16px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px', boxSizing: 'border-box' },
    button: { width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
    result: { marginTop: '24px', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', textAlign: 'center', fontSize: '20px', color: '#166534', fontWeight: 'bold' },
    error: { marginTop: '16px', color: 'red', textAlign: 'center' }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏥 Medical Insurance Cost Predictor</h2>
      <form onSubmit={handleSubmit}>
        <label style={styles.label}>Age</label>
        <input style={styles.input} name="age" type="number" value={form.age} onChange={handleChange} required placeholder="e.g. 30" />

        <label style={styles.label}>Sex</label>
        <select style={styles.input} name="sex" value={form.sex} onChange={handleChange}>
          <option value="0">Male</option>
          <option value="1">Female</option>
        </select>

        <label style={styles.label}>BMI</label>
        <input style={styles.input} name="bmi" type="number" step="0.01" value={form.bmi} onChange={handleChange} required placeholder="e.g. 27.5" />

        <label style={styles.label}>Number of Children</label>
        <input style={styles.input} name="children" type="number" value={form.children} onChange={handleChange} required placeholder="e.g. 2" />

        <label style={styles.label}>Smoker</label>
        <select style={styles.input} name="smoker" value={form.smoker} onChange={handleChange}>
          <option value="0">Yes</option>
          <option value="1">No</option>
        </select>

        <label style={styles.label}>Region</label>
        <select style={styles.input} name="region" value={form.region} onChange={handleChange}>
          <option value="0">Southeast</option>
          <option value="1">Southwest</option>
          <option value="2">Northeast</option>
          <option value="3">Northwest</option>
        </select>

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict Cost'}
        </button>
      </form>

      {result !== null && (
        <div style={styles.result}>
          Estimated Insurance Cost: <br />💰 ${result.toLocaleString()}
        </div>
      )}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  )
}

export default App