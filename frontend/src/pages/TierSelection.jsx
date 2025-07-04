import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Add this new Tooltip component at the top of the file
const Tooltip = ({ text }) => (
  <div className="tooltip">
    <span className="tooltip-trigger">ⓘ</span>
    <div 
      className="tooltip-content"
      dangerouslySetInnerHTML={{ 
        __html: text
      }}
    />
  </div>
);

export default function TierSelection() {
    const navigate = useNavigate();
    const [selectedTier, setSelectedTier] = useState('');
    const [showError, setShowError] = useState(false);
    
    const handleSelect = () => {
      if (!selectedTier) {
        setShowError(true);
        return;
      }
      setShowError(false);
      navigate('/storage');  // Navigate to storage selection page
    };
  
    return (
      <div className="page-container">
        <h1 className="text-center mb-6">Select Your Tier Package</h1>
        
        <div className="tiers-container">
          {/* First Row */}
          <div className="section tier-option">
            <div className="tier-header">
              <input
                type="radio"
                id="starter-trial"
                name="tier"
                value="starter-trial"
                checked={selectedTier === 'starter-trial'}
                onChange={(e) => {
                  setSelectedTier(e.target.value);
                  setShowError(false);
                }}
                className="tier-radio"
              />
              <label htmlFor="starter-trial" className="tier-label">
                <h2>30-day Free Trial - 50 wells</h2>
                <p className="tier-limit">Up to 50 wells</p>
              </label>
            </div>
            <div className="tier-content">
              <p>Select any set of wells you would like to analyze, up to 100 wells</p>
              <ul className="tier-features">
                <li>Data analysis on all well data types. Include production volumes (Oil, Gas, NGLs, Water.  OPEX (LOS preferable or LOE statements), water hauling charges/bbl or SWD fees/bbl, etc.</li>
                <li>Include .LAS, seismic (all file extensions), .CSV, .xlsx, Google sheets, PDF's, hand written notes and more. If it has your data, include it.</li>
                <li className="feature-with-tooltip">
                <strong>Your proprietary data always stays in your control.  There are two options. Mouse over the tooltip for more information.</strong>
                  <Tooltip text={`<b>Option 1</b>: Select your data via your workstation.  Our system maps to your data where is resides without modifying in any way.  We make a copy of the pertinent data at your control when you submit for processing.  All copied data is deleted immediately after processing. You maintain control of your data at all times.

<b>Option 2</b>: Pinn AI secure cloud silo - At your selection (next page) we immediately create a cloud-based silo for your data.  Your data is encrypted and accessible only by you.  When setup is complete, your are emailed a temporary password that must be changed upon first login.  We never see your data nor do we have access to it.  As above, you select your data and it is uploaded into the silo for your use only.`} />
                </li>
                <li>Basic data analysis</li>
                <li>Save, Export and Standard reporting disabled</li>
                <li>Onboarding support and feature training videos</li>
              </ul>
            </div>
          </div>

          <div className="section tier-option">
            <div className="tier-header">
              <input
                type="radio"
                id="starter-plus"
                name="tier"
                value="starter-plus"
                checked={selectedTier === 'starter-plus'}
                onChange={(e) => {
                  setSelectedTier(e.target.value);
                  setShowError(false);
                }}
                className="tier-radio"
              />
              <label htmlFor="starter-plus" className="tier-label">
                <h2>Starter Plus - 100 wells</h2>
                <p className="tier-limit">Up to 100 wells - $2,500/month + usage fees</p>
              </label>
            </div>
            <div className="tier-content">
              <p>Select any set of wells you would like to analyze, up to 100 wells</p>
              <ul className="tier-features">
              <li>Everything in the Starter Package, plus;</li>
                
                <li className="feature-with-tooltip">
                <strong>Your proprietary data always stays in your control.  There are two options. Mouse over the tooltip for more information.</strong>
                  <Tooltip text={`<b>Option 1</b>: Select your data via your workstation.  Our system maps to your data where is resides without modifying in any way.  We make a copy of the pertinent data at your control when you submit for processing.  All copied data is deleted immediately after processing. You maintain control of your data at all times.

<b>Option 2</b>: Pinn AI secure cloud silo - At your selection (next page) we immediately create a cloud-based silo for your data.  Your data is encrypted and accessible only by you.  When setup is complete, your are emailed a temporary password that must be changed upon first login.  We never see your data nor do we have access to it.  As above, you select your data and it is uploaded into the silo for your use only.`} />
                </li>
                <li>Enhanced data analysis</li>
                <li>Save and Standard reporting enabled</li>
                <li>Onboarding support and feature training available</li>
                <li>24 hour turnaround email support</li>
              </ul>
            </div>
          </div>

          <div className="section tier-option">
            <div className="tier-header">
              <input
                type="radio"
                id="essential"
                name="tier"
                value="essential"
                checked={selectedTier === 'essential'}
                onChange={(e) => {
                  setSelectedTier(e.target.value);
                  setShowError(false);
                }}
                className="tier-radio"
              />
              <label htmlFor="essential" className="tier-label">
                <h2>Essential - 200 wells</h2>
                <p className="tier-limit">Up to 200 wells - $3,500/month + usage fees</p>
              </label>
            </div>
            <div className="tier-content">
              <p>Select any set of wells you would like to analyze, up to 200 wells</p>
              <ul className="tier-features">
              <li>Everything in the Starter Plus Package, plus;</li>
                <li className="feature-with-tooltip">
                <strong>Your proprietary data always stays in your control.  There are two options. Mouse over the tooltip for more information.</strong>
                  <Tooltip text={`<b>Option 1</b>: Select your data via your workstation.  Our system maps to your data where is resides without modifying in any way.  We make a copy of the pertinent data at your control when you submit for processing.  All copied data is deleted immediately after processing. You maintain control of your data at all times.

<b>Option 2</b>: Pinn AI secure cloud silo - At your selection (next page) we immediately create a cloud-based silo for your data.  Your data is encrypted and accessible only by you.  When setup is complete, your are emailed a temporary password that must be changed upon first login.  We never see your data nor do we have access to it.  As above, you select your data and it is uploaded into the silo for your use only.`} />
                </li>
                <li>Advanced data analysis</li>
                <li>Custom reporting</li>
                <li>Priority support</li>
              </ul>
            </div>
          </div>

          {/* Second Row */}
          <div className="section tier-option">
            <div className="tier-header">
              <input
                type="radio"
                id="professional"
                name="tier"
                value="professional"
                checked={selectedTier === 'professional'}
                onChange={(e) => {
                  setSelectedTier(e.target.value);
                  setShowError(false);
                }}
                className="tier-radio"
              />
              <label htmlFor="professional" className="tier-label">
                <h2>Professional - 500 wells</h2>
                <p className="tier-limit">Up to 500 wells - $5,000/month + usage fees</p>
              </label>
            </div>
            <div className="tier-content">
              <p>Select any set of wells you would like to analyze, up to 500 wells</p>
              <ul className="tier-features">
              <li>Everything in the Essential Package, plus;</li>
                <li className="feature-with-tooltip">
                <strong>Your proprietary data always stays in your control.  There are two options. Mouse over the tooltip for more information.</strong>
                  <Tooltip text={`<b>Option 1</b>: Select your data via your workstation.  Our system maps to your data where is resides without modifying in any way.  We make a copy of the pertinent data at your control when you submit for processing.  All copied data is deleted immediately after processing. You maintain control of your data at all times.

<b>Option 2</b>: Pinn AI secure cloud silo - At your selection (next page) we immediately create a cloud-based silo for your data.  Your data is encrypted and accessible only by you.  When setup is complete, your are emailed a temporary password that must be changed upon first login.  We never see your data nor do we have access to it.  As above, you select your data and it is uploaded into the silo for your use only.`} />
                </li>
                <li>Full data analysis suite</li>
                <li>Advanced analytics</li>
                <li>Optimal well location, HZ lateral depth, Recommende Frac recipies</li>
                <li>Custom Reporting and Export Options (PhDWin, ARIES, Petrel, Kingdom, etc.)</li>
                <li>24/7 premium support</li>
              </ul>
            </div>
          </div>

          <div className="section tier-option">
            <div className="tier-header">
              <input
                type="radio"
                id="premium"
                name="tier"
                value="premium"
                checked={selectedTier === 'premium'}
                onChange={(e) => {
                  setSelectedTier(e.target.value);
                  setShowError(false);
                }}
                className="tier-radio"
              />
              <label htmlFor="premium" className="tier-label">
                <h2>Premium - 1,000 wells</h2>
                <p className="tier-limit">Up to 1,000 wells - $10,000/month + usage fees</p>
              </label>
            </div>
            <div className="tier-content">
              <p>Select any set of wells you would like to analyze, up to 5,000 wells</p>
              <ul className="tier-features">
              <li>Everything in the Professional Package, plus;</li>
                <li className="feature-with-tooltip">
                <strong>Your proprietary data always stays in your control.  There are two options. Mouse over the tooltip for more information.</strong>
                  <Tooltip text={`<b>Option 1</b>: Select your data via your workstation.  Our system maps to your data where is resides without modifying in any way.  We make a copy of the pertinent data at your control when you submit for processing.  All copied data is deleted immediately after processing. You maintain control of your data at all times.

<b>Option 2</b>: Pinn AI secure cloud silo - At your selection (next page) we immediately create a cloud-based silo for your data.  Your data is encrypted and accessible only by you.  When setup is complete, your are emailed a temporary password that must be changed upon first login.  We never see your data nor do we have access to it.  As above, you select your data and it is uploaded into the silo for your use only.`} />
                </li>
                <li>Full data analysis suite</li>
                <li>Advanced analytics</li>
                <li>Optimal well location, HZ lateral depth, Recommende Frac recipies</li>
                <li>Custom Reporting and Export Options (PhDWin, ARIES, Petrel, Kingdom, etc.)</li>
                <li>24/7 premium support</li>
              </ul>
            </div>
          </div>

          <div className="section tier-option">
            <div className="tier-header">
              <input
                type="radio"
                id="enterprise"
                name="tier"
                value="enterprise"
                checked={selectedTier === 'enterprise'}
                onChange={(e) => {
                  setSelectedTier(e.target.value);
                  setShowError(false);
                }}
                className="tier-radio"
              />
              <label htmlFor="enterprise" className="tier-label">
                <h2>Enterprise - Unlimited wells</h2>
                <p className="tier-limit">Unlimited wells - $15,000/month + usage fees</p>
              </label>
            </div>
            <div className="tier-content">
              <p>Custom solution for your enterprise needs</p>
              <ul className="tier-features">
              <li>Everything in Premium Package, plus;</li>
                <li className="feature-with-tooltip">
                <strong>Your proprietary data always stays in your control.  There are two options. Mouse over the tooltip for more information.</strong>
                  <Tooltip text={`<b>Option 1</b>: Select your data via your workstation.  Our system maps to your data where is resides without modifying in any way.  We make a copy of the pertinent data at your control when you submit for processing.  All copied data is deleted immediately after processing. You maintain control of your data at all times.

<b>Option 2</b>: Pinn AI secure cloud silo - At your selection (next page) we immediately create a cloud-based silo for your data.  Your data is encrypted and accessible only by you.  When setup is complete, your are emailed a temporary password that must be changed upon first login.  We never see your data nor do we have access to it.  As above, you select your data and it is uploaded into the silo for your use only.`} />
                </li>
                <li>Unlimited wells</li>
                <li>Custom integrations</li>
                <li>Dedicated support team</li>
                <li>Full data analysis suite</li>
                <li>Advanced analytics</li>
                <li>Optimal well location, HZ lateral depth, Recommende Frac recipies</li>
                <li>Custom Reporting and Export Options (PhDWin, ARIES, Petrel, Kingdom, etc.)</li>
                <li>24/7 premium support</li>
              </ul>
            </div>
          </div>
        </div>

        {showError && (
          <div className="terms-error-message">
            Please select a tier package to proceed.
          </div>
        )}

        <div className="text-center mt-6">
          <button
            onClick={handleSelect}
            className="button"
          >
            Continue
          </button>
        </div>
      </div>
    );
}