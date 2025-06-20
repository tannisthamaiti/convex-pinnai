import React from 'react';

export default function TableA5View() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 20, backgroundColor: '#f9f9f9' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, marginBottom: 20 }}>
        <caption style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
          TABLE A5 – Base Case: Proved Developed Producing Reserves and Future Net Revenue
        </caption>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            {[
              'Year', 'Oil (10³ bbl)', 'Gas (10⁶ ft³)', 'Oil Price (US$/bbl)', 'Gas Price (US$/10³ ft³)',
              'Gross Revenue (10³ US$)', 'Royalties (10³ US$)', 'Operating Exp. (10³ US$)', 'Capital Costs',
              'Abandonment', 'Indirect Taxes', 'Income Tax', 'Net Revenue (10³ US$)', 'Present Worth @10% (10³ US$)'
            ].map(header => (
              <th key={header} style={{ border: '1px solid #ccc', padding: 8 }}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ['2024', '2,929.35', '0.00', '80.00', '-', '234,348', '20,713', '78,082', '0', '0', '253', '20,633', '114,667', '108,690'],
            ['2025', '2,494.32', '0.00', '75.00', '-', '187,074', '14,329', '64,943', '0', '0', '253', '16,401', '91,148', '78,208'],
            ['2026', '2,123.45', '0.00', '70.00', '-', '148,642', '11,278', '52,421', '0', '0', '253', '12,776', '71,914', '58,210'],
            ['2027', '1,832.10', '0.00', '68.00', '-', '124,583', '9,241', '45,320', '0', '0', '253', '10,314', '59,455', '44,970'],
            ['2028', '1,503.90', '0.00', '65.00', '-', '97,754', '7,033', '39,110', '0', '0', '253', '8,041', '43,317', '31,675'],
          ].map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} style={{ border: '1px solid #ccc', padding: 8, textAlign: 'center' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 40 }}>
        <div style={{ fontSize: 13 }}>
          <strong>Notes:</strong>
          <ol>
            <li>
              Reserves were estimated only to the limits of economic production as defined under the
              Definition of Reserves heading of this report, or to the expiration dates of the concession
              extensions as advised by Seacrest Petroleo, whichever occurs first.
            </li>
            <li>
              Projected forecasts and estimated economic limits are estimated to occur after the expiration
              dates of the concession agreements. Seacrest Petroleo has represented that it will meet the
              conditions required by the ANP to obtain concession extensions. Based on this representation,
              and at Seacrest Petroleo’s request, the reserves evaluated herein consider the potential
              concession extensions.
            </li>
          </ol>
        </div>

        <div style={{ fontSize: 13 }}>
          <strong>Present Worth (10³ U.S.$) at:</strong>
          <table style={{ marginTop: 5 }}>
            <tbody>
              <tr><td>8 Percent</td><td style={{ textAlign: 'right' }}>374,711</td></tr>
              <tr><td>12 Percent</td><td style={{ textAlign: 'right' }}>343,824</td></tr>
              <tr><td>15 Percent</td><td style={{ textAlign: 'right' }}>322,515</td></tr>
              <tr><td>20 Percent</td><td style={{ textAlign: 'right' }}>290,735</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <a
        href="/downloads/Seacrest_CPR_TableA5_2023.pdf"
        download
        style={{
          backgroundColor: '#2e86c1',
          color: 'white',
          padding: '10px 20px',
          textDecoration: 'none',
          fontSize: 14,
          borderRadius: 5,
          display: 'inline-block',
          marginTop: 20
        }}
      >
        📥 Download Full Report (PDF)
      </a>
    </div>
  );
}

