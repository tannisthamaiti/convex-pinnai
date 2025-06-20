import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CloudSiloSetup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    title: '',
    department: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Load user info from registration when component mounts
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userRegistration');
    if (savedUserInfo) {
      const parsedInfo = JSON.parse(savedUserInfo);
      setForm(prevForm => ({
        ...prevForm,
        ...parsedInfo
      }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
    // Store the potentially updated information
    localStorage.setItem('cloudSiloInfo', JSON.stringify(form));
    // Simulate sending credentials
    setTimeout(() => {
      navigate('/upload');
    }, 3000);
  };

  return (
    <div className="page-container">
      <h1>Secure Cloud Silo Setup</h1>
      
      {!showConfirmation ? (
        <div className="section">
          <p className="info-text">
            We'll set up your secure cloud silo and send temporary access credentials
            to your email. Please confirm or update your information below.
          </p>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="email">
                Email to receive credentials <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="auto-populated"
              />
            </div>

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
                className="auto-populated"
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
                className="auto-populated"
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
                className="auto-populated"
              />
            </div>

            {/* Optional fields */}
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="auto-populated"
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                id="department"
                name="department"
                value={form.department}
                onChange={handleChange}
                className="auto-populated"
              />
            </div>

            <div className="info-box">
              <h3>Important Security Information</h3>
              <ul>
                <li>Your secure silo will be set up within 15 minutes</li>
                <li>Temporary credentials will be sent to your email</li>
                <li>You must change your password upon first login</li>
                <li>Only you will have access to your data</li>
                <li>Data is encrypted at rest and in transit</li>
              </ul>
            </div>

            <button type="submit" className="button">
              Set Up My Secure Silo
            </button>
          </form>
        </div>
      ) : (
        <div className="section">
          <div className="confirmation-message">
            <div className="spinner"></div>
            <h2>Setting Up Your Secure Silo</h2>
            <p>
              We're preparing your secure cloud environment. You'll receive an email
              with temporary credentials shortly. Redirecting to file selection...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
