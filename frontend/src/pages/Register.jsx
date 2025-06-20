import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    company: '',
    wells: '',
    department: ''
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showError, setShowError] = useState(false);  // This controls the error message

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setShowError(true);  // Show error if terms not agreed
      return;
    }
    // If we get here, terms were agreed to
    
    // Store the registration data in localStorage
    localStorage.setItem('userRegistration', JSON.stringify(form));
    
    navigate('/tiers');
  };

  // Add console.log to debug
  console.log('showError:', showError);
  console.log('agreedToTerms:', agreedToTerms);

  return (
    <div className="register-form-container">
      <h2>Register for Access</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="firstName">
            First Name <span className="required">*</span>
          </label>
          <input 
            id="firstName" 
            name="firstName" 
            value={form.firstName} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">
            Last Name <span className="required">*</span>
          </label>
          <input 
            id="lastName" 
            name="lastName" 
            value={form.lastName} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input 
            id="title" 
            name="title" 
            value={form.title} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Company Email <span className="required">*</span>
          </label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="company">
            Company Name <span className="required">*</span>
          </label>
          <input 
            id="company" 
            name="company" 
            value={form.company} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="wells">
            Max wells to analyze (5–100,000) <span className="required">*</span>
          </label>
          <input 
            id="wells" 
            name="wells" 
            value={form.wells} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department</label>
          <input 
            id="department" 
            name="department" 
            value={form.department} 
            onChange={handleChange} 
          />
        </div>

        <div className="terms-container">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked);
                if (e.target.checked) {
                  setShowError(false);  // Clear error when checkbox is checked
                }
              }}
              className="terms-checkbox"
            />
            <label htmlFor="terms" className="terms-label">
              I have read and agree to the{' '}
              <a 
                href="/terms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="terms-link"
              >
                Terms of Service
              </a>
              {' '}and{' '}
              <a 
                href="/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="terms-link"
              >
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Simplified error message condition */}
          {showError && (
            <div className="terms-error-message" style={{
              color: '#dc2626',
              fontSize: '0.95rem',
              marginTop: '0.5rem',
              fontWeight: '500',
              textAlign: 'left',
              padding: '0.5rem',
              backgroundColor: '#fee2e2',
              borderRadius: '4px',
              border: '1px solid #fecaca'
            }}>
              Please accept the Terms of Service and Privacy Policy.
            </div>
          )}
        </div>

        <button 
          type="submit" 
          style={{
            opacity: agreedToTerms ? 1 : 0.7,
            cursor: agreedToTerms ? 'pointer' : 'not-allowed'
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
}