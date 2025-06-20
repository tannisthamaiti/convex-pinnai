import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>
        <img 
          src="/Logo.png" 
          alt="Earthscan Logo" 
          style={{ height: '40px', cursor: 'pointer' }}
        />
      </div>
      <div className="navbar-links">
        <button 
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          Home
        </button>
        <button 
          className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`nav-link ${location.pathname === '/upload' ? 'active' : ''}`}
          onClick={() => navigate('/upload')}
        >
          Select Data
        </button>
         {/* <button 
          className={`nav-link ${location.pathname === '/roi' ? 'active' : ''}`}
          onClick={() => navigate('/roi')}
        >
          ROI Calculator
        </button> */}
      </div>
    </nav>
  );
}
