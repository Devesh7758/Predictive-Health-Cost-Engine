import React, { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    age: '',
    sex: 'female',
    bmi: '',
    children: '0',
    smoker: 'no',
    state: 'Delhi',
    district: 'North Delhi'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const delhiDistricts = [
    'North Delhi',
    'South Delhi',
    'East Delhi',
    'West Delhi',
    'New Delhi',
    'Dwarka'
  ];

  const indianStates = [
    'Delhi',
    'Haryana',
    'Punjab',
    'Uttar Pradesh',
    'Maharashtra',
    'Karnataka'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(''); 
    if (name === 'state' && value !== 'Delhi') {
      setFormData({ ...formData, [name]: value, district: 'General' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const parsedAge = parseInt(formData.age);
    const parsedBmi = parseFloat(formData.bmi);
    const parsedChildren = parseInt(formData.children);

    if (parsedAge < 1 || parsedAge > 120) {
      setError('Please enter a valid age between 1 and 120.');
      setLoading(false);
      return;
    }
    if (parsedBmi < 10.0 || parsedBmi > 60.0) {
      setError('Please enter a realistic BMI value between 10.0 and 60.0.');
      setLoading(false);
      return;
    }
    if (parsedChildren < 0 || parsedChildren > 20) {
      setError('Dependent children cannot exceed 20.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parsedAge,
          sex: formData.sex,
          bmi: parsedBmi,
          children: parsedChildren,
          smoker: formData.smoker,
          state: formData.state,
          district: formData.district
        })
      });

      if (!response.ok) {
        throw new Error('Server rejected the data formatting.');
      }

      const data = await response.json();
      setResult(data.predicted_charges_inr);
    } catch (err) {
      setError('An error occurred while communicating with the engine.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '500px', margin: '50px auto', padding: '30px', border: '1px solid #e0e0e0', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '24px' }}>Predictive Health Cost Engine (India)</h2>
      
      {error && (
        <div style={{ padding: '12px', marginBottom: '20px', background: '#fff3cd', color: '#856404', border: '1px solid #ffeeba', borderRadius: '6px', fontSize: '14px', fontWeight: '500', textAlign: 'center' }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Age (1 - 120)</label>
          <input type="number" name="age" min="1" max="120" value={formData.age} onChange={handleChange} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>BMI (10.0 - 60.0)</label>
          <input type="number" step="0.1" name="bmi" min="10" max="60" value={formData.bmi} onChange={handleChange} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Dependent Children (0 - 20)</label>
          <input type="number" name="children" min="0" max="20" value={formData.children} onChange={handleChange} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Gender</label>
          <select name="sex" value={formData.sex} onChange={handleChange} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Smoker Status</label>
          <select name="smoker" value={formData.smoker} onChange={handleChange} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>State</label>
          <select name="state" value={formData.state} onChange={handleChange} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}>
            {indianStates.map((st) => <option key={st} value={st}>{st}</option>)}
          </select>
        </div>
        
        {formData.state === 'Delhi' && (
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Delhi District / Region</label>
            <select name="district" value={formData.district} onChange={handleChange} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}>
              {delhiDistricts.map((dist) => <option key={dist} value={dist}>{dist}</option>)}
            </select>
          </div>
        )}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
          {loading ? 'Calculating...' : 'Forecast Premium (₹)'}
        </button>
      </form>
      
      {result !== null && (
        <div style={{ marginTop: '24px', padding: '16px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '5px solid #007bff', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#555' }}>Estimated Annual Premium:</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#007bff', margin: '0' }}>₹{result.toLocaleString('en-IN')}</p>
        </div>
      )}
    </div>
  );
}

export default App;