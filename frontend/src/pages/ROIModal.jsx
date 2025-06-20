import React, { useState } from 'react';
import './ROIModal.css';

const plans = [
  {
    title: 'Starter',
    roi: '56.40%',
    wells: '25 to 75 wells',
    features: [
      'Basic analytics dashboard',
      'Email support',
      'Manual data input'
    ]
  },
  {
    title: 'Essential',
    roi: '62.88%',
    wells: '76 to 220 wells',
    features: [
      'Advanced analytics tools',
      'Priority email support',
      'Automated reporting'
    ],
    badge: 'Highest ROI'
  },
  {
    title: 'Premium',
    roi: '62.06%',
    wells: '221 to 350 wells',
    features: [
      'Full automation suite',
      'Phone and email support',
      'Customized dashboards'
    ]
  },
  {
    title: 'Enterprise',
    roi: '54.04%',
    wells: '350+ wells',
    features: [
      'Dedicated account manager',
      'Full API access',
      'Enterprise-grade analytics'
    ]
  }
];

const ROIModal = () => {
  const [wage, setWage] = useState('');
  const [hours, setHours] = useState(6);
  const [wells, setWells] = useState('');
  const [packageType, setPackageType] = useState('');
  const [result, setResult] = useState(null);

  const handleCalculate = async () => {
    try {
      const response = await fetch('https://etscan.org/calculate-roi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageType,
          wage: parseFloat(wage),
          hours: parseFloat(hours),
          wells: parseInt(wells)
        })
      });

      if (!response.ok) throw new Error('Backend error');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert('Calculation failed: ' + err.message);
    }
  };

  return (
    <div className="wrapper">
      <h1 className="title">ROI Pricing Plans</h1>
      <div className="plan-container">
        {plans.map((plan, idx) => (
          <div key={idx} className="plan-card">
            <div className="plan-title">{plan.title}</div>
            <div className="roi">{plan.roi} Cost Reduction</div>
            <div className="wells">Ideal for {plan.wells}</div>
            <ul className="features">
              {plan.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
            {plan.badge && <div className="badge">{plan.badge}</div>}
          </div>
        ))}
      </div>

      <div className="calculator">
        <h2>ROI Calculator</h2>
        <select value={packageType} onChange={(e) => setPackageType(e.target.value)}>
          <option disabled value="">Select package</option>
          {plans.map(p => (
            <option key={p.title}>{p.title}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Wage per hour"
          value={wage}
          onChange={e => setWage(e.target.value)}
        />
        <input
          type="number"
          placeholder="Total man hours per year"
          value={hours}
          onChange={e => setHours(e.target.value)}
        />
        <input
          type="number"
          placeholder="Number of Wells"
          value={wells}
          onChange={e => setWells(e.target.value)}
        />
        <button onClick={handleCalculate}>Calculate ROI</button>

        {result && (
          <div style={{ marginTop: '1rem', background: '#e9ffe9', padding: '1rem', borderRadius: '5px' }}>
            <p><strong>Manual Cost:</strong> ${result.manual_cost.toFixed(2)}</p>
            <p><strong>ROI:</strong> {result.roi_percent.toFixed(2)}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ROIModal;
